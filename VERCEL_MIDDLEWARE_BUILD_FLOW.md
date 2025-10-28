# Vercel CLI Middleware 编译流程详解

基于源码分析：`/Users/vincentlli/Documents/demo/ali-cli/vercel-source/packages`

## 📂 核心文件位置

### 1. **主构建入口**
```
packages/next/src/index.ts
```
- 主要的 build 函数 (第 206 行)
- 负责整个 Next.js 项目的构建流程

### 2. **Middleware 相关核心文件**
```
packages/next/src/
├── middleware-launcher.ts          # Middleware 运行时启动器
├── server-build.ts                 # 服务端构建逻辑（包含 middleware）
├── utils.ts                        # 工具函数（getMiddlewareBundle, getNodeMiddleware 等）
└── edge-function-source/
    ├── get-edge-function.ts        # Edge Function 包装器
    └── get-edge-function-source.ts # Edge Function 源码生成
```

## 🔄 完整编译流程

### 阶段 1: 扫描和检测 (index.ts)

```typescript
// 第 206 行：build 函数开始
export const build: BuildV2 = async buildOptions => {
  
  // 1. 下载文件
  await download(files, workPath, meta);
  
  // 2. 安装依赖
  await runNpmInstall(...);
  
  // 3. 执行 next build
  await runPackageJsonScript(
    entryPath,
    buildScriptName, // 'vercel-build' or 'next build'
    { ...spawnOpts, env },
    ...
  );
}
```

**关键代码位置**:
- `index.ts:258` - 下载文件
- `index.ts:368-396` - 安装依赖
- `index.ts:517-563` - 执行构建命令

### 阶段 2: 读取 Next.js 构建产物 (index.ts)

```typescript
// 构建完成后读取各种 manifest
const routesManifest = await getRoutesManifest(
  entryPath,
  outputDirectory,
  nextVersion
); // 第 607 行

const prerenderManifest = await getPrerenderManifest(
  entryPath,
  outputDirectory
); // 第 613 行

// 重要：这里会读取 middleware-manifest.json
// 在 server-build.ts 中处理
```

**关键文件扫描**:
- `.next/routes-manifest.json` - 路由配置
- `.next/prerender-manifest.json` - 预渲染配置
- `.next/middleware-manifest.json` - **Middleware 配置**
- `.next/required-server-files.json` - 服务端必需文件

### 阶段 3: Server Build 处理 (server-build.ts)

```typescript
// index.ts 第 1504 行调用
return serverBuild({
  config,
  functionsConfigManifest,
  nextVersion,
  trailingSlash,
  appPathRoutesManifest,
  dynamicPages,
  canUsePreviewMode,
  staticPages,
  localePrefixed404,
  lambdaPages: pages,
  lambdaAppPaths,
  omittedPrerenderRoutes,
  isCorrectLocaleAPIRoutes,
  pagesDir,
  headers,
  beforeFilesRewrites,
  afterFilesRewrites,
  fallbackRewrites,
  workPath,
  redirects,
  nodeVersion,
  dynamicPrefix,
  routesManifest,
  imagesManifest,
  wildcardConfig,
  prerenderManifest,
  entryDirectory,
  entryPath,
  baseDir,
  dataRoutes,
  buildId,
  escapedBuildId,
  outputDirectory,
  trailingSlashRedirects,
  requiredServerFilesManifest,
  privateOutputs,
  hasIsr404Page,
  hasIsr500Page,
  variantsManifest,
  experimentalPPRRoutes,
  isAppPPREnabled,
  isAppFullPPREnabled,
  isAppClientSegmentCacheEnabled,
  isAppClientParamParsingEnabled,
  clientParamParsingOrigins,
  files,
});
```

### 阶段 4: 获取 Middleware Bundle (utils.ts)

这是核心的 middleware 扫描和处理函数：

```typescript
// utils.ts 中的函数 (需要查看完整实现)
export async function getMiddlewareBundle(params: {
  entryPath: string;
  outputDirectory: string;
  routesManifest: RoutesManifest;
  // ... 其他参数
}): Promise<{ 
  middleware: EdgeFunction | undefined;
  middlewareManifest: MiddlewareManifest;
}> {
  
  // 1. 读取 middleware-manifest.json
  const manifestPath = path.join(
    entryPath,
    outputDirectory,
    'server',
    'middleware-manifest.json'
  );
  
  const middlewareManifest = await readJSON(manifestPath);
  
  // 2. 检查是否有 middleware
  if (!middlewareManifest.middleware) {
    return { middleware: undefined, middlewareManifest };
  }
  
  // 3. 读取编译后的 middleware.js
  const middlewarePath = path.join(
    entryPath,
    outputDirectory,
    'server',
    middlewareManifest.middleware.files[0] // 通常是 'middleware.js'
  );
  
  const middlewareCode = await readFile(middlewarePath, 'utf8');
  
  // 4. 创建 Edge Function
  const middleware = await createEdgeFunction({
    name: 'middleware',
    code: middlewareCode,
    regions: middlewareManifest.middleware.regions,
    // ...
  });
  
  return { middleware, middlewareManifest };
}
```

**关键扫描位置**:
```
.next/
├── server/
│   ├── middleware.js                  # Next.js 编译后的 middleware
│   ├── middleware-manifest.json       # Middleware 元数据
│   └── middleware-runtime.js          # Middleware 运行时
```

### 阶段 5: 创建 Edge Function (edge-function-source/)

#### 5.1 获取 Edge Function 源码

```typescript
// edge-function-source/get-edge-function-source.ts
export function getNextjsEdgeFunctionSource(params: NextjsParams): string {
  return `
    // Edge Function 包装器代码
    import getNextjsEdgeFunction from './get-edge-function';
    
    const params = ${JSON.stringify(params)};
    export default getNextjsEdgeFunction(params);
  `;
}
```

#### 5.2 Edge Function 包装器

```typescript
// edge-function-source/get-edge-function.ts (第 41 行)
export default function getNextjsEdgeFunction(
  params: NextjsParams
): EdgeFunction {
  // 1. 编译路由正则
  const staticRoutes = params.staticRoutes.map(route => ({
    regexp: new RegExp(route.namedRegex!),
    page: route.page,
  }));
  
  const dynamicRoutes = params.dynamicRoutes?.map(route => ({
    regexp: new RegExp(route.namedRegex!),
    page: route.page,
  })) || [];
  
  // 2. 返回 Edge Function 处理函数
  return async function edgeFunction(request, context) {
    let pathname = new URL(request.url).pathname;
    
    // 移除 basePath 和 locale
    // ...
    
    // 匹配页面路由
    // ...
    
    // 调用实际的 middleware 函数
    const result = await withNextRequestContext(
      { waitUntil: context.waitUntil },
      () => _ENTRIES[`middleware_${params.name}`].default.call(
        {},
        {
          request: {
            url: request.url,
            method: request.method,
            headers: toPlainHeaders(request.headers),
            // ...
          },
        }
      )
    );
    
    return result.response;
  };
}
```

### 阶段 6: Middleware 启动器 (middleware-launcher.ts)

这是运行时的 middleware 入口：

```typescript
// middleware-launcher.ts (第 32 行)
const middlewareModule = require('__NEXT_MIDDLEWARE_PATH__');

const serve = async (request: Request): Promise<Response> => {
  const context = getVercelRequestContext();
  
  return await withNextRequestContext(
    { waitUntil: context.waitUntil },
    async () => {
      // 加载 middleware 模块
      let middlewareHandler = await middlewareModule;
      middlewareHandler = middlewareHandler.default || middlewareHandler;
      
      // 调用 middleware
      const result = await middlewareHandler({
        request: {
          url: request.url,
          method: request.method,
          headers: toPlainHeaders(request.headers),
          nextConfig: conf,
          page: '/middleware',
          body: request.method !== 'GET' && request.method !== 'HEAD' 
            ? request.body 
            : undefined,
          waitUntil: context.waitUntil,
        },
      });
      
      // 处理 waitUntil
      if (result.waitUntil && context.waitUntil) {
        context.waitUntil(result.waitUntil);
      }
      
      return result.response;
    }
  );
};

module.exports = serve;
```

## 🔍 关键数据结构

### Middleware Manifest 结构

```json
{
  "middleware": {
    "/": {
      "env": [],
      "files": ["middleware.js"],
      "name": "middleware",
      "page": "/",
      "matchers": [
        {
          "regexp": "^/about(/.*)?$",
          "originalSource": "/about/:path*"
        }
      ],
      "regions": ["iad1"],
      "wasm": [],
      "assets": []
    }
  },
  "sortedMiddleware": ["/"],
  "version": 2
}
```

### Routes Manifest 结构

```json
{
  "version": 4,
  "pages404": true,
  "basePath": "",
  "redirects": [],
  "rewrites": {
    "beforeFiles": [],
    "afterFiles": [],
    "fallback": []
  },
  "headers": [],
  "dynamicRoutes": [],
  "staticRoutes": [],
  "dataRoutes": [],
  "i18n": null,
  "rsc": {
    "header": "RSC",
    "contentTypeHeader": "text/x-component",
    "clientParamParsing": true
  }
}
```

## 🛠️ 工具函数调用链

```
build() (index.ts:206)
  ↓
runPackageJsonScript() → next build
  ↓
[Next.js 内部编译]
  ↓
serverBuild() (server-build.ts:110)
  ↓
getMiddlewareBundle() (utils.ts)
  ↓
createEdgeFunction()
  ↓
getNextjsEdgeFunctionSource() (edge-function-source/get-edge-function-source.ts)
  ↓
打包成 Edge Function
```

## 📋 调试建议

### 在 CLI 源码中添加断点位置：

1. **入口断点**: `packages/next/src/index.ts:206` - build 函数开始
2. **构建命令**: `packages/next/src/index.ts:542` - 执行 next build
3. **Server Build**: `packages/next/src/index.ts:1504` - serverBuild 调用
4. **Middleware 扫描**: `packages/next/src/utils.ts` - getMiddlewareBundle 函数
5. **Edge Function 创建**: `packages/next/src/edge-function-source/get-edge-function.ts:41`

### 在编译后的 dist/index.js 中查找：

你可以搜索这些关键字来定位代码：

```javascript
// 搜索这些字符串
"middleware-manifest.json"
"getMiddlewareBundle"
"middleware.js"
"Edge Function"
"_ENTRIES"
```

## 📦 实际构建产物

### Next.js 构建后的文件结构

```
.next/
├── server/
│   ├── middleware-manifest.json       # ← Vercel CLI 读取这个
│   ├── edge-runtime-webpack.js        # Edge Runtime 基础代码
│   └── src/
│       └── middleware.js              # ← 你的 middleware 编译后的代码
└── ...
```

### middleware-manifest.json 实际内容

```json
{
  "version": 3,
  "middleware": {
    "/": {
      "files": [
        "server/edge-runtime-webpack.js",
        "server/src/middleware.js"
      ],
      "name": "src/middleware",
      "page": "/",
      "matchers": [
        {
          "regexp": "^/.*$",
          "originalSource": "/:path*"
        }
      ],
      "wasm": [],
      "assets": [],
      "env": {
        "__NEXT_BUILD_ID": "lmokqQvXHekv7uJ00tSIq",
        "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "...",
        "__NEXT_PREVIEW_MODE_ID": "...",
        "__NEXT_PREVIEW_MODE_SIGNING_KEY": "...",
        "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "..."
      }
    }
  },
  "functions": {},
  "sortedMiddleware": ["/"]
}
```

### 编译后的 middleware.js

```javascript
// webpack 打包后的代码（压缩）
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[550],{
  // ... 大量 webpack runtime 代码 ...
  
  // 你的 middleware 逻辑被包装在这里
  export function middleware(request, event) {
    // 你的 middleware 代码
    return NextResponse.redirect('/new-location')
  }
  
  // ... 更多 webpack 模块 ...
}]);
```

## 🔍 Vercel CLI 如何处理这些文件

### 步骤 1: 扫描 middleware-manifest.json

```typescript
// packages/next/src/utils.ts
async function getMiddlewareBundle(
  entryPath: string,
  outputDirectory: string
) {
  // 读取 manifest
  const manifestPath = path.join(
    entryPath,
    outputDirectory,
    'server',
    'middleware-manifest.json'
  );
  
  const manifest = await readJSON(manifestPath);
  
  // 检查是否有 middleware
  if (!manifest.middleware) {
    return undefined;
  }
  
  return manifest;
}
```

### 步骤 2: 读取编译后的文件

```typescript
// 根据 manifest 中的 files 字段读取
const middlewareFiles = manifest.middleware['/'].files;
// ["server/edge-runtime-webpack.js", "server/src/middleware.js"]

for (const file of middlewareFiles) {
  const filePath = path.join(entryPath, outputDirectory, file);
  const content = await readFile(filePath, 'utf8');
  // 收集所有需要的文件
}
```

### 步骤 3: 创建 Edge Function

```typescript
// packages/next/src/edge-function-source/get-edge-function-source.ts
const edgeFunctionCode = `
import { middleware } from './middleware.js';

export default async function handler(request, context) {
  // 包装用户的 middleware
  const result = await middleware({
    request,
    env: ${JSON.stringify(manifest.middleware['/'].env)},
  });
  
  return result;
}
`;
```

### 步骤 4: 添加路由规则

```typescript
// 根据 manifest 中的 matchers 创建路由
const middlewareRoutes = manifest.middleware['/'].matchers.map(matcher => ({
  src: matcher.regexp,  // "^/.*$"
  middlewarePath: '/__middleware',
  continue: true,
}));

// 添加到总路由配置中
routes.unshift(...middlewareRoutes);
```

## 💡 总结

### Vercel CLI 处理 middleware 的完整流程：

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 用户运行: vercel build                                    │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Vercel CLI 执行: next build                              │
│    - Next.js 将 src/middleware.ts 编译                      │
│    - 生成 .next/server/src/middleware.js                    │
│    - 生成 .next/server/middleware-manifest.json             │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Vercel CLI 扫描构建产物                                   │
│    代码位置: packages/next/src/index.ts:607                 │
│    - 读取 middleware-manifest.json                          │
│    - 检查 manifest.middleware 是否存在                       │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. 读取 middleware 文件                                      │
│    代码位置: packages/next/src/utils.ts:getMiddlewareBundle │
│    - 读取 manifest.middleware['/'].files                    │
│    - 读取 server/edge-runtime-webpack.js                    │
│    - 读取 server/src/middleware.js                          │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. 创建 Edge Function                                        │
│    代码位置: packages/next/src/edge-function-source/        │
│    - 将 middleware.js 包装成 Edge Function                  │
│    - 注入环境变量 (env)                                      │
│    - 添加 request context                                   │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. 添加路由规则                                              │
│    代码位置: packages/next/src/server-build.ts              │
│    - 根据 matchers 创建路由正则                              │
│    - 添加到路由配置中                                        │
│    - 确保 middleware 在其他路由之前执行                      │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. 生成 .vercel/output                                       │
│    - config.json (包含路由配置)                              │
│    - functions/__middleware.func/ (Edge Function)           │
│    - static/ (静态资源)                                      │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. 部署到 Vercel                                             │
│    - Edge Function 部署到边缘节点                            │
│    - 路由规则生效                                            │
└─────────────────────────────────────────────────────────────┘
```

### 开发者只需要做的事情：

1. **创建 middleware.ts**
   ```typescript
   // src/middleware.ts
   import { NextResponse } from 'next/server';
   
   export function middleware(request) {
     return NextResponse.next();
   }
   
   export const config = {
     matcher: '/about/:path*',
   };
   ```

2. **运行构建命令**
   ```bash
   vercel build  # 或 vercel deploy
   ```

3. **完成！** 🎉

Vercel CLI 会自动：
- ✅ 编译 middleware
- ✅ 扫描构建产物
- ✅ 创建 Edge Function
- ✅ 配置路由
- ✅ 部署到边缘网络

