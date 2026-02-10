
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    
import "../../../esm-chunks/chunk-6BT4RYQJ.js";

// src/build/functions/middleware/middleware.ts
import { compile } from "./compiler.js";
import { join } from "node:path";
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "node:fs";
var compileMiddleware = async (ctx) => {
  const possiblePaths = [
    // 1. Next.js 15+: distDir/server/middleware.js (直接在 .next 目录下)
    join(ctx.distDir, "server/middleware.js"),
    // 2. Next.js 15+: standaloneDir/.next/server/middleware.js
    join(ctx.standaloneDir, ".next/server/middleware.js"),
    // 3. 旧版: standaloneDir/.next/server/src/middleware.js
    join(ctx.standaloneDir, ".next/server/src/middleware.js"),
    // 4. 旧版: distDir/server/src/middleware.js
    join(ctx.distDir, "server/src/middleware.js"),
    // 5. 相对于当前工作目录
    join(process.cwd(), ".next/server/middleware.js"),
    join(process.cwd(), ".next/server/src/middleware.js")
  ];
  let middlewareFilePath = "";
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      middlewareFilePath = path;
      break;
    }
  }
  if (!middlewareFilePath) {
    return null;
  }
  const result = await compile(middlewareFilePath, {
    env: { DEBUG: "true" }
  });
  const outputDir = join(ctx.distDir, "functions");
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, "compiled-middleware.js");
  writeFileSync(outputPath, result.code || "", "utf-8");
  const edgeFunctionPath = join(process.cwd(), ".edgeone/edge-functions/index.js");
  if (existsSync(edgeFunctionPath)) {
    let edgeFunctionCode = readFileSync(edgeFunctionPath, "utf-8");
    if (edgeFunctionCode.includes(`'__MIDDLEWARE_BUNDLE_CODE__'`)) {
      edgeFunctionCode = edgeFunctionCode.replace(`'__MIDDLEWARE_BUNDLE_CODE__'`, () => result.code || "");
      writeFileSync(edgeFunctionPath, edgeFunctionCode, "utf-8");
    }
  }
  return result;
};
export {
  compileMiddleware
};
