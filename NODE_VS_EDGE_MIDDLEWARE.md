# Node Middleware vs Edge Middleware 详解

## 🎯 核心区别

在 Vercel CLI 构建过程中，你看到的两个 middleware 处理函数针对的是**两种不同的运行时环境**：

### 1. **`nodeMiddleware` = Node.js Runtime Middleware (旧版)**

```typescript
// packages/next/src/utils.ts:3665
export async function getNodeMiddleware({...}): Promise<null | {
  lambdas: Record<string, NodejsLambda>;  // ← 返回 Node.js Lambda
  routes: RouteWithSrc[];
}>
```

**特点**:
- 🏃 运行在：**Node.js Lambda 环境**
- 📦 类型：`NodejsLambda`
- 📁 读取文件：`.next/server/middleware.js` + `.nft.json` (trace 文件)
- 📝 配置来源：`functions-config-manifest.json` 中的 `/_middleware`
- ⏱️ 冷启动：较慢（~100-300ms）
- 💾 运行时：完整的 Node.js 环境
- 🎯 用途：**旧版 Next.js 的 middleware 实现（< v12）**

**代码逻辑**:

```typescript
// 1. 检查是否有 Node.js middleware 配置
const middlewareFunctionConfig = 
  functionsConfigManifest?.functions['/_middleware'];

if (!middlewareFunctionConfig) {
  return null;  // 没有 Node.js middleware
}

// 2. 读取 middleware.js 和依赖文件
const middlewareFile = path.join(
  entryPath,
  outputDirectory,
  'server',
  'middleware.js'
);

// 3. 创建 Node.js Lambda
const lambda = new NodejsLambda({
  runtime: nodeVersion,  // 'nodejs18.x', 'nodejs20.x' 等
  handler: '___next_launcher.cjs',
  files: {
    ...tracedFiles,  // 通过 nft 追踪的依赖文件
    middleware.js,
    ___next_launcher.cjs,
  },
});

return {
  routes: [...],
  lambdas: {
    _middleware: lambda,  // ← Node.js Lambda
  },
};
```

---

### 2. **`middleware` = Edge Runtime Middleware/Functions (新版)**

```typescript
// packages/next/src/utils.ts:3843
export async function getMiddlewareBundle({...}): Promise<{
  staticRoutes: Route[];
  dynamicRouteMap: ReadonlyMap<string, RouteWithSrc>;
  edgeFunctions: Record<string, EdgeFunction>;  // ← 返回 Edge Functions
}>
```

**特点**:
- ⚡ 运行在：**Vercel Edge Runtime** (基于 V8 Isolate)
- 📦 类型：`EdgeFunction`
- 📁 读取文件：`.next/server/middleware-manifest.json`
- 📝 配置来源：`middleware-manifest.json` 中的 `middleware` 和 `functions` 字段
- ⏱️ 冷启动：极快（~0-10ms）
- 💾 运行时：轻量级 V8 Isolate，受限的 API
- 🎯 用途：**现代 Next.js 的 middleware 和 Edge API Routes（>= v12）**

**代码逻辑**:

```typescript
// 1. 读取 middleware-manifest.json
const middlewareManifest = await getMiddlewareManifest(
  entryPath,
  outputDirectory
);

// 示例 manifest 内容:
// {
//   "version": 3,
//   "middleware": {
//     "/": { 
//       "files": ["server/src/middleware.js"],
//       "name": "src/middleware",
//       "matchers": [...]
//     }
//   },
//   "functions": {
//     "/api/edge": {
//       "files": ["server/pages/api/edge.js"],
//       "name": "pages/api/edge",
//       "matchers": [...]
//     }
//   }
// }

// 2. 处理所有 middleware 和 edge functions
const sortedFunctions = [
  // middleware 条目
  ...middlewareManifest.sortedMiddleware.map(key => ({
    key,
    edgeFunction: middlewareManifest.middleware[key],
    type: 'middleware',
  })),
  
  // edge functions 条目（Edge API Routes）
  ...Object.entries(middlewareManifest.functions ?? {}).map(
    ([key, edgeFunction]) => ({
      key,
      edgeFunction,
      type: 'function',
    })
  ),
];

// 3. 为每个条目创建 Edge Function
for (const { edgeFunction } of sortedFunctions) {
  // 包装源码（添加路由匹配逻辑）
  const wrappedModuleSource = await getNextjsEdgeFunctionSource(
    edgeFunction.files,
    {
      name: edgeFunction.name,
      staticRoutes: routesManifest.staticRoutes,
      dynamicRoutes: routesManifest.dynamicRoutes,
      nextConfig: { basePath, i18n },
    },
    outputDirectory,
    edgeFunction.wasm
  );

  // 创建 Edge Function 对象
  const ef = new EdgeFunction({
    deploymentTarget: 'v8-worker',  // ← Edge Runtime
    name: edgeFunction.name,
    files: {
      'index.js': wrappedModuleSource,  // 包装后的代码
      'index.js.map': sourceMap,
      ...wasmFiles,   // WebAssembly 文件
      ...assetFiles,  // 静态资源
    },
    regions: normalizeRegions(edgeFunction.regions),
    environment: edgeFunction.env,
  });
  
  edgeFunctions[shortPath] = ef;  // ← 添加到返回对象
}

return {
  staticRoutes: [...],
  dynamicRouteMap: new Map(),
  edgeFunctions: {  // ← 已经是处理好的 Edge Functions！
    'src/middleware': EdgeFunction {...},
    'api/edge': EdgeFunction {...},
    // ... 其他 edge functions
  },
};
```

---

## 📊 对比表格

| 特性 | `nodeMiddleware` (Node.js) | `middleware` (Edge) |
|------|---------------------------|---------------------|
| **运行时** | Node.js Lambda | Vercel Edge Runtime (V8) |
| **对象类型** | `NodejsLambda` | `EdgeFunction` |
| **配置文件** | `functions-config-manifest.json` | `middleware-manifest.json` |
| **源文件** | `.next/server/middleware.js` | `.next/server/src/middleware.js` |
| **冷启动** | 100-300ms | 0-10ms |
| **内存限制** | 可配置 (最高 3GB) | 固定 (~128MB) |
| **可用 API** | 完整 Node.js API | 受限的 Web 标准 API |
| **适用版本** | Next.js < v12 | Next.js >= v12 |
| **使用场景** | 旧项目兼容 | 现代项目推荐 |

---

## ✅ 回答你的问题

### **到第 15156 行时，middleware.edgeFunctions 是否已经处理成边缘函数了？**

**答案：是的！✅**

```typescript
// 第 15145-15154 行
const middleware = await getMiddlewareBundle({
  config,
  entryPath,
  outputDirectory,
  routesManifest,
  isCorrectMiddlewareOrder,
  prerenderBypassToken: prerenderManifest.bypassToken || "",
  nextVersion,
  appPathRoutesManifest: appPathRoutesManifest || {}
});

// 第 15156 行
const edgeFunctions = middleware.edgeFunctions;
//                    ↑
//    这里的 edgeFunctions 已经是一个对象，包含所有处理好的 EdgeFunction 实例
```

**具体来说**：

1. **`getMiddlewareBundle` 已经完成了所有处理**：
   - ✅ 读取了 `middleware-manifest.json`
   - ✅ 读取了所有 middleware 和 edge function 的源文件
   - ✅ 包装了源码（添加路由匹配逻辑）
   - ✅ 创建了 `EdgeFunction` 对象
   - ✅ 配置了 regions、environment 等

2. **`middleware.edgeFunctions` 是一个完整的对象**：
   ```typescript
   {
     'src/middleware': EdgeFunction {
       deploymentTarget: 'v8-worker',
       name: 'src/middleware',
       files: {
         'index.js': FileBlob {...},
         'index.js.map': FileBlob {...}
       },
       regions: ['iad1'],
       environment: { ... }
     },
     'api/edge': EdgeFunction {...},
     // ... 其他 edge functions
   }
   ```

3. **第 15156-15204 行只是在做路由复制**：
   ```typescript
   // 为 App Router 的 .rsc 和 .prefetch.rsc 创建额外的路由映射
   for (const page of Object.values(appPathRoutesManifest)) {
     const pathname = path.posix.join("./", entryDirectory, page);
     
     // 如果这个路径有对应的 edge function，复制一份给 .rsc 版本
     if (edgeFunctions[pathname]) {
       edgeFunctions[`${pathname}.rsc`] = edgeFunctions[pathname];
       
       if (isAppPPREnabled) {
         edgeFunctions[`${pathname}.prefetch.rsc`] = edgeFunctions[pathname];
       }
     }
   }
   ```

---

## 🔍 实际例子

假设你有这样的项目结构：

```typescript
// src/middleware.ts
export function middleware(request) {
  return NextResponse.next();
}

// app/api/edge/route.ts
export const runtime = 'edge';
export async function GET() {
  return new Response('Hello from edge');
}
```

### 构建后的 manifest:

```json
{
  "version": 3,
  "middleware": {
    "/": {
      "files": ["server/src/middleware.js"],
      "name": "src/middleware",
      "matchers": [{ "regexp": "^/.*$" }]
    }
  },
  "functions": {
    "/api/edge": {
      "files": ["server/app/api/edge/route.js"],
      "name": "app/api/edge/route",
      "matchers": [{ "regexp": "^/api/edge$" }]
    }
  }
}
```

### `getMiddlewareBundle` 返回:

```typescript
{
  staticRoutes: [...],
  dynamicRouteMap: Map {...},
  edgeFunctions: {
    'src/middleware': EdgeFunction {
      name: 'src/middleware',
      files: { 'index.js': '...' },
      // ... 已完全配置
    },
    'api/edge': EdgeFunction {
      name: 'api/edge',
      files: { 'index.js': '...' },
      // ... 已完全配置
    }
  }
}
```

---

## 💡 总结

1. **两个 middleware 是不同的东西**：
   - `nodeMiddleware`：旧版 Node.js Lambda middleware（较少使用）
   - `middleware`：现代 Edge Functions（包括 middleware 和 edge routes）

2. **到第 15156 行时，一切都已准备就绪**：
   - ✅ Edge Functions 已创建
   - ✅ 源码已包装
   - ✅ 配置已应用
   - ✅ 可以直接使用

3. **后续代码只是在做路由映射**：
   - 为 App Router 的 RSC 请求创建额外的路由
   - 为 PPR（Partial Prerendering）创建 prefetch 路由
   - 不会修改 EdgeFunction 对象本身

这就是为什么你会看到 `middleware.edgeFunctions` 可以直接使用——因为 `getMiddlewareBundle` 已经完成了所有的重活！🎉

