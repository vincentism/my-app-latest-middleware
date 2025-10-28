# Edge Runtime 如何处理不支持的 Node.js API

## 🎯 核心机制

在编译 middleware 成 Edge Function 的过程中，对不支持的语法（如 `fs`、`path` 等 Node.js 模块）有**三层处理机制**：

---

## 📍 第一层：Next.js 编译时替换（Webpack）

### 位置：Next.js 内部编译

在 `next build` 时，Next.js 使用 Webpack 将不支持的 Node.js 模块替换为 `__import_unsupported` 函数。

### 实际例子

**你的源码**：
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import fs from 'fs';  // ❌ Edge Runtime 不支持

export function middleware(request) {
  const data = fs.readFileSync('file.txt');  // ❌ 会报错
  return NextResponse.next();
}
```

**Next.js 编译后**（`.next/server/src/middleware.js`）：
```javascript
// webpack 编译后的代码
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[550],{
  // ...
  
  // 🔥 关键：定义 __import_unsupported 函数
  function l(a){
    return `The edge runtime does not support Node.js '${a}' module.
    Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`
  }
  
  // 🔥 在 globalThis 上定义错误处理
  Object.defineProperty(globalThis,"__import_unsupported",{
    value:function(moduleName){
      // 返回一个 Proxy 对象
      let errorProxy = new Proxy(function(){},{
        // 当访问任何属性时抛出错误
        get(target, prop){
          if("then"===prop) return {};  // 避免 await 时直接报错
          throw Object.defineProperty(
            Error(l(moduleName)),
            "__NEXT_ERROR_CODE",
            {value:"E394",enumerable:!1,configurable:!0}
          )
        },
        // 当构造函数调用时抛出错误
        construct(){
          throw Object.defineProperty(
            Error(l(moduleName)),
            "__NEXT_ERROR_CODE",
            {value:"E394",enumerable:!1,configurable:!0}
          )
        },
        // 当函数调用时抛出错误
        apply(target, thisArg, args){
          if("function"==typeof args[0]) return args[0](errorProxy);
          throw Object.defineProperty(
            Error(l(moduleName)),
            "__NEXT_ERROR_CODE",
            {value:"E394",enumerable:!1,configurable:!0}
          )
        }
      });
      
      // 返回一个 Proxy，所有属性访问都返回 errorProxy
      return new Proxy({},{
        get:()=>errorProxy
      })
    },
    enumerable:!1,
    configurable:!1
  });
  
  // 🔥 你的 middleware 中的 fs 被替换成：
  const fs = __import_unsupported('fs');
  
  // 当你调用 fs.readFileSync 时：
  fs.readFileSync('file.txt')  
  // ↓
  // 访问 fs.readFileSync 触发 Proxy get
  // ↓
  // 抛出错误: "The edge runtime does not support Node.js 'fs' module."
}]);
```

---

## 📍 第二层：Webpack 配置排除（编译时）

### Next.js 的 Webpack 配置

Next.js 在编译 middleware 时使用特殊的 Webpack 配置：

```javascript
// Next.js 内部配置（简化版）
{
  target: 'webworker',  // Edge Runtime 目标
  resolve: {
    alias: {
      // 不支持的 Node.js 模块映射到错误处理
      'fs': false,
      'path': false,
      'crypto': false,
      'http': false,
      'https': false,
      'stream': false,
      'zlib': false,
      // ... 更多
    },
    fallback: {
      // 部分模块使用 polyfill
      'buffer': require.resolve('buffer/'),
      'events': require.resolve('events/'),
      'util': require.resolve('util/'),
      // ... 其他 polyfills
    }
  },
  plugins: [
    // 注入 __import_unsupported 处理
    new webpack.DefinePlugin({
      'process.browser': false,
      'process.env.NEXT_RUNTIME': JSON.stringify('edge')
    })
  ]
}
```

---

## 📍 第三层：运行时检测（Vercel Edge Runtime）

### Edge Runtime 的限制

Vercel Edge Runtime 基于 V8 Isolate，只支持：

**✅ 支持的 API**：
```javascript
// Web 标准 API
fetch()
Request
Response
Headers
URL
URLSearchParams
crypto.subtle
TextEncoder / TextDecoder
atob / btoa
setTimeout / setInterval
console

// 部分 Node.js API（通过 polyfill）
Buffer
process.env
```

**❌ 不支持的 API**：
```javascript
// 文件系统
fs.*
path.*

// 网络
http.*
https.*
net.*
dns.*

// 进程
child_process.*
cluster.*
process.exit()
process.kill()

// 原生模块
任何 .node 原生模块
```

---

## 🔍 实际演示

### 场景 1：使用 fs 模块

**源码**：
```typescript
// src/middleware.ts
import fs from 'fs';

export function middleware(request) {
  const data = fs.readFileSync('file.txt');
  return NextResponse.next();
}
```

**编译时**：
```javascript
// Next.js 编译后
const fs = __import_unsupported('fs');

export function middleware(request) {
  const data = fs.readFileSync('file.txt');  
  // ↑ 运行时会抛出错误
  return NextResponse.next();
}
```

**运行时错误**：
```
Error: The edge runtime does not support Node.js 'fs' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime
```

---

### 场景 2：使用支持的 crypto（Web Crypto）

**源码**：
```typescript
// src/middleware.ts
export async function middleware(request) {
  // ✅ 使用 Web Crypto API（支持）
  const buffer = new TextEncoder().encode('hello');
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  
  console.log('Hash:', hash);
  return NextResponse.next();
}
```

**编译后**：
```javascript
// 正常编译，不会被替换
export async function middleware(request) {
  const buffer = new TextEncoder().encode('hello');
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  
  console.log('Hash:', hash);
  return NextResponse.next();
}
```

✅ **运行成功**：使用的是 Web 标准 Crypto API

---

### 场景 3：尝试绕过检测（也会失败）

**源码**：
```typescript
// src/middleware.ts
export function middleware(request) {
  // 尝试动态 require
  const fs = require('fs');  // ❌ 仍然不行
  
  return NextResponse.next();
}
```

**编译后**：
```javascript
export function middleware(request) {
  // require 也被替换了
  const fs = __import_unsupported('fs');
  
  return NextResponse.next();
}
```

---

## 📋 编译流程中的处理

```
┌─────────────────────────────────────────────────────────┐
│ 1. 你写的 middleware.ts                                  │
│    - import fs from 'fs'                                │
│    - const data = fs.readFileSync(...)                 │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Next.js Webpack 编译（检测不支持的模块）               │
│    - 扫描 import/require 语句                            │
│    - 检查是否是 Edge Runtime 不支持的模块                 │
│    - fs, path, http, etc. → 替换为 __import_unsupported │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 生成 .next/server/src/middleware.js                  │
│    globalThis.__import_unsupported = function(name) {   │
│      return Proxy { throw Error(...) }                  │
│    }                                                    │
│    const fs = __import_unsupported('fs');               │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Vercel CLI 封装成 Edge Function                       │
│    - 读取编译后的 middleware.js                          │
│    - 包装路由匹配逻辑                                     │
│    - 创建 EdgeFunction 对象                              │
│    - 不做额外的模块检查（已在编译时完成）                  │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 部署到 Vercel Edge Runtime                            │
│    - V8 Isolate 环境                                    │
│    - 只有 Web 标准 API 可用                              │
│    - 调用 fs.* 时触发 Proxy                              │
│    - 抛出运行时错误                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🛡️ 如何正确编写 Edge Middleware

### ✅ 推荐做法

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  // ✅ 使用 Web 标准 API
  const url = new URL(request.url);
  const headers = new Headers(request.headers);
  
  // ✅ 使用环境变量
  const apiKey = process.env.API_KEY;
  
  // ✅ 使用 fetch
  const response = await fetch('https://api.example.com');
  
  // ✅ 使用 crypto (Web Crypto API)
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  
  return NextResponse.next();
}
```

### ❌ 避免的做法

```typescript
// src/middleware.ts
import fs from 'fs';           // ❌ 不支持
import path from 'path';       // ❌ 不支持
import http from 'http';       // ❌ 不支持
import { exec } from 'child_process';  // ❌ 不支持

export function middleware(request) {
  // ❌ 文件系统操作
  const data = fs.readFileSync('config.json');
  
  // ❌ 路径操作（部分支持，但不推荐）
  const filePath = path.join(__dirname, 'file.txt');
  
  // ❌ HTTP 服务器
  http.createServer(...);
  
  // ❌ 执行命令
  exec('ls -la');
  
  return NextResponse.next();
}
```

---

## 💡 总结

1. **编译时替换**：Next.js Webpack 将不支持的模块替换为 `__import_unsupported`
2. **Proxy 拦截**：运行时访问这些模块的任何属性都会抛出友好的错误信息
3. **V8 隔离**：Edge Runtime 环境本身就不提供 Node.js 模块
4. **开发者友好**：错误信息清晰，指向文档说明

这种三层防护确保：
- ✅ 编译时就能发现问题
- ✅ 运行时有清晰的错误提示
- ✅ 不会因为缺少模块而崩溃
- ✅ 引导开发者使用正确的 API

