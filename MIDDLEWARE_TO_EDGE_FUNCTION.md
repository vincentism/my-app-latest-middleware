# Middleware 封装成 Edge Function 的完整流程

## 🎯 封装发生的位置

### 核心调用链

```
getMiddlewareBundle()                    [utils.ts:3843]
  ↓
getNextjsEdgeFunctionSource()            [edge-function-source/get-edge-function-source.ts:27]
  ↓
new EdgeFunction()                       [utils.ts:3954]
```

---

## 📍 第一步：读取 middleware 源码

**位置**：`packages/next/src/utils.ts:3890-3908`

```typescript
const workerConfigs = await Promise.all(
  sortedFunctions.map(async ({ key, edgeFunction, type }) => {
    try {
      // 🔥 关键：调用 getNextjsEdgeFunctionSource 进行封装
      const wrappedModuleSource = await getNextjsEdgeFunctionSource(
        edgeFunction.files,  // ["server/edge-runtime-webpack.js", "server/src/middleware.js"]
        {
          name: edgeFunction.name,           // "src/middleware"
          staticRoutes: routesManifest.staticRoutes,
          dynamicRoutes: routesManifest.dynamicRoutes.filter(
            r => !('isMiddleware' in r)
          ),
          nextConfig: {
            basePath: routesManifest.basePath,
            i18n: routesManifest.i18n,
          },
        },
        path.resolve(entryPath, outputDirectory),  // "/path/to/.next"
        edgeFunction.wasm
      );
      // ... 继续处理
    }
  })
);
```

**此时的输入**：
- `edgeFunction.files`: `["server/edge-runtime-webpack.js", "server/src/middleware.js"]`
- 原始的 middleware 编译代码（webpack bundle）

---

## 📍 第二步：包装 Middleware 源码 ⭐ **核心封装逻辑**

**位置**：`packages/next/src/edge-function-source/get-edge-function-source.ts:27-66`

这是**最关键的封装步骤**！

```typescript
export async function getNextjsEdgeFunctionSource(
  filePaths: string[],      // ["server/edge-runtime-webpack.js", "server/src/middleware.js"]
  params: NextjsParams,     // { name, staticRoutes, dynamicRoutes, nextConfig }
  outputDir: string,        // "/path/to/.next"
  wasm?: { filePath: string; name: string }[]
): Promise<Source> {
  
  // 1️⃣ 创建全局命名空间
  const chunks = new ConcatSource(raw(`globalThis._ENTRIES = {};`));
  
  // 2️⃣ 读取并合并所有 middleware 文件
  for (const filePath of filePaths) {
    const fullFilePath = join(outputDir, filePath);
    const content = await readFile(fullFilePath, 'utf8');
    chunks.add(raw(`\n/**/;`));
    chunks.add(await fileToSource(content, filePath, fullFilePath));
  }
  
  // 此时 chunks 包含：
  // globalThis._ENTRIES = {};
  // 
  // /**/; [edge-runtime-webpack.js 的内容]
  // /**/; [src/middleware.js 的内容 - 你的 middleware 逻辑]
  
  // 3️⃣ 包装模板代码（来自预编译的模板）
  const getPageMatchCode = `(function () {
    const module = { exports: {}, loaded: false };
    const fn = (function(module,exports) {${template}\n});
    fn(module, module.exports);
    return module.exports;
  })`;
  
  // template 是从 dist/___get-nextjs-edge-function.js 加载的
  // 它包含路由匹配、请求处理等逻辑（见下面的详细内容）
  
  // 4️⃣ 生成最终的 Edge Function 源码
  return sourcemapped`
  ${raw(getWasmImportStatements(wasm))}
  ${chunks};
  export default ${raw(getPageMatchCode)}.call({}).default(
    ${raw(JSON.stringify(params))}
  )`;
}
```

**生成的源码结构**：

```javascript
// 最终生成的 Edge Function 代码（简化版）

// 1. WASM imports (如果有)
const wasm_xxx = require('/wasm/xxx.wasm');

// 2. 你的 middleware 源码
globalThis._ENTRIES = {};

/**/; 
// [edge-runtime-webpack.js 内容]
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([...]);

/**/;
// [src/middleware.js 内容 - 包含你的 middleware 逻辑]
_ENTRIES["middleware_src/middleware"] = {
  default: async function middleware(request) {
    // 你的 middleware 代码
    return NextResponse.next();
  }
};

// 3. 包装器代码（template）
export default (function () {
  const module = { exports: {}, loaded: false };
  const fn = (function(module, exports) {
    // 这里是 get-edge-function.ts 的内容
    // 包括路由匹配、basePath 处理、i18n 处理等
    
    function getNextjsEdgeFunction(params) {
      // 编译路由正则
      const staticRoutes = params.staticRoutes.map(route => ({
        regexp: new RegExp(route.namedRegex!),
        page: route.page,
      }));
      
      // 返回实际的 Edge Function handler
      return async function edgeFunction(request, context) {
        let pathname = new URL(request.url).pathname;
        
        // 处理 basePath
        if (params.nextConfig?.basePath) {
          if (pathname.startsWith(params.nextConfig.basePath)) {
            pathname = pathname.replace(params.nextConfig.basePath, '') || '/';
          }
        }
        
        // 处理 i18n locale
        if (params.nextConfig?.i18n) {
          for (const locale of params.nextConfig.i18n.locales) {
            const regexp = new RegExp(`^/${locale}($|/)`, 'i');
            if (pathname.match(regexp)) {
              pathname = pathname.replace(regexp, '/') || '/';
              break;
            }
          }
        }
        
        // 匹配路由
        let pageMatch = {};
        for (const route of staticRoutes) {
          const result = route.regexp.exec(pathname);
          if (result) {
            pageMatch.name = route.page;
            break;
          }
        }
        
        // 🔥 调用你的 middleware
        const result = await _ENTRIES[`middleware_${params.name}`].default.call(
          {},
          {
            request: {
              url: request.url,
              method: request.method,
              headers: toPlainHeaders(request.headers),
              nextConfig: params.nextConfig,
              page: pageMatch,
              body: request.body,
            },
          }
        );
        
        return result.response;
      };
    }
    
    module.exports.default = getNextjsEdgeFunction;
  });
  
  fn(module, module.exports);
  return module.exports;
})().call({}).default(
  // 注入参数
  {
    "name": "src/middleware",
    "staticRoutes": [...],
    "dynamicRoutes": [...],
    "nextConfig": { "basePath": "", "i18n": null }
  }
);
```

---

## 📍 第三步：创建 EdgeFunction 对象

**位置**：`packages/next/src/utils.ts:3914-3989`

```typescript
return {
  type,
  page: edgeFunction.page,
  name: edgeFunction.name,
  edgeFunction: (() => {
    // 1️⃣ 获取包装后的源码
    const { source, map } = wrappedModuleSource.sourceAndMap();
    
    // 2️⃣ 处理 source map
    const transformedMap = stringifySourceMap(
      transformSourceMap(map)
    );
    
    // 3️⃣ 处理 WASM 文件
    const wasmFiles = (edgeFunction.wasm ?? []).reduce(
      (acc: Files, { filePath, name }) => {
        const fullFilePath = path.join(entryPath, outputDirectory, filePath);
        acc[`wasm/${name}.wasm`] = new FileFsRef({
          mode: 0o644,
          contentType: 'application/wasm',
          fsPath: fullFilePath,
        });
        return acc;
      },
      {}
    );
    
    // 4️⃣ 处理静态资源
    const assetFiles = (edgeFunction.assets ?? []).reduce(
      (acc: Files, { filePath, name }) => {
        const fullFilePath = path.join(entryPath, outputDirectory, filePath);
        acc[`assets/${name}`] = new FileFsRef({
          mode: 0o644,
          contentType: 'application/octet-stream',
          fsPath: fullFilePath,
        });
        return acc;
      },
      {}
    );
    
    // 5️⃣ 🔥 创建最终的 EdgeFunction 对象
    return new EdgeFunction({
      deploymentTarget: 'v8-worker',  // Edge Runtime 环境
      name: edgeFunction.name,
      files: {
        // 主入口文件（包装后的源码）
        'index.js': new FileBlob({
          data: source,  // ← 这里包含了完整的包装代码
          contentType: 'application/javascript',
          mode: 0o644,
        }),
        // Source map
        ...(transformedMap && {
          'index.js.map': new FileBlob({
            data: transformedMap,
            contentType: 'application/json',
            mode: 0o644,
          }),
        }),
        // WASM 文件
        ...wasmFiles,
        // 静态资源
        ...assetFiles,
      },
      regions: edgeFunction.regions
        ? normalizeRegions(edgeFunction.regions)
        : undefined,
      entrypoint: 'index.js',  // 入口文件
      assets: (edgeFunction.assets ?? []).map(({ name }) => ({
        name,
        path: `assets/${name}`,
      })),
      framework: {
        slug: 'nextjs',
        version: nextVersion,
      },
      environment: edgeFunction.env,  // 环境变量
    });
  })(),
  routeMatchers: getRouteMatchers(edgeFunction, routesManifest),
};
```

---

## 🔍 实际例子

### 输入（你写的 middleware）

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware executed for:', request.url);
  return NextResponse.next();
}

export const config = {
  matcher: '/about/:path*',
};
```

### Next.js 编译后

```javascript
// .next/server/src/middleware.js (webpack bundle)
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[550],{
  // ... webpack runtime ...
  
  _ENTRIES["middleware_src/middleware"] = {
    default: async function(params) {
      const { request } = params;
      console.log('Middleware executed for:', request.url);
      return NextResponse.next();
    }
  };
}]);
```

### Vercel CLI 封装后

```javascript
// Edge Function 最终代码
globalThis._ENTRIES = {};

// 你的 middleware webpack bundle
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([...]);

// 包装器代码
export default (function() {
  // ... 路由匹配逻辑 ...
  
  return async function edgeFunction(request, context) {
    // 1. 处理 basePath
    // 2. 处理 i18n
    // 3. 匹配路由
    // 4. 调用你的 middleware
    const result = await _ENTRIES["middleware_src/middleware"].default.call({}, {
      request: {
        url: request.url,
        method: request.method,
        headers: { ... },
        nextConfig: { ... },
        page: { ... },
        body: request.body,
      }
    });
    
    return result.response;
  };
})()({
  name: "src/middleware",
  staticRoutes: [...],
  dynamicRoutes: [...],
  nextConfig: { basePath: "", i18n: null }
});
```

---

## 📋 封装位置总结

| 步骤 | 文件 | 行号 | 作用 |
|------|------|------|------|
| 1 | `utils.ts` | 3890-3908 | 调用封装函数，传入参数 |
| 2 | `get-edge-function-source.ts` | 27-66 | **核心封装**：读取源码 + 包装模板 |
| 3 | `utils.ts` | 3914-3989 | 创建 `EdgeFunction` 对象 |
| 4 | `utils.ts` | 4009-4041 | 将 EdgeFunction 添加到返回对象 |

## 🎯 关键点

1. **封装的核心**在 `getNextjsEdgeFunctionSource()` 函数（第27行）
2. **包装模板**来自预编译的 `get-edge-function.ts`
3. **最终对象**是 `new EdgeFunction()` 创建的（第3954行）
4. **返回时**已经是完整的、可部署的 Edge Function

所以当你在第 15156 行看到 `middleware.edgeFunctions` 时，整个封装过程已经完成！🎉

