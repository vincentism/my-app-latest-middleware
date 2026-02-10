
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    
import "../esm-chunks/chunk-6BT4RYQJ.js";

// src/build/routes.ts
import * as fs from "fs";
import * as path from "path";
function isRE2Compatible(regexSource) {
  const unsupported = [
    /\(\?[=!<]/,
    // 断言（前瞻、后顾）
    /\(\?>/,
    // 原子组
    /\\(\d+)/,
    // 反向引用 \1 \2
    /\(\?\(/
    // 条件表达式
  ];
  return !unsupported.some((r) => r.test(regexSource));
}
async function getMiddlewareConfig(ctx) {
  try {
    const manifest = await ctx.getMiddlewareManifest();
    if (manifest && manifest.middleware && manifest.middleware["/"]) {
      const middlewareInfo = manifest.middleware["/"];
      const matchers = middlewareInfo.matchers || [];
      const normalizedMatchers = matchers.map((m) => ({
        source: m.originalSource || "/:path*",
        regex: m.regexp
      }));
      const hasIncompatibleRegex = normalizedMatchers.some(
        (item) => item.regex && !isRE2Compatible(item.regex)
      );
      if (hasIncompatibleRegex) {
        return {
          runtime: "edge",
          matcher: [{ source: "/:path*" }]
        };
      }
      return {
        runtime: "edge",
        matcher: normalizedMatchers.map((item) => ({ source: item.source }))
      };
    }
    const possibleFunctionsConfigPaths = [
      path.join(process.cwd(), ".next/server/functions-config-manifest.json"),
      path.join(ctx.distDir, "server/functions-config-manifest.json")
    ];
    let functionsConfigPath = "";
    for (const p of possibleFunctionsConfigPaths) {
      if (fs.existsSync(p)) {
        functionsConfigPath = p;
        break;
      }
    }
    if (functionsConfigPath) {
      const functionsConfig = JSON.parse(fs.readFileSync(functionsConfigPath, "utf-8"));
      const middlewareConfig = functionsConfig?.functions?.["/_middleware"];
      if (middlewareConfig && middlewareConfig.matchers) {
        const matchers = middlewareConfig.matchers;
        const normalizedMatchers = matchers.map((m) => ({
          source: m.originalSource || "/:path*",
          regex: m.regexp
        }));
        const hasIncompatibleRegex = normalizedMatchers.some(
          (item) => item.regex && !isRE2Compatible(item.regex)
        );
        if (hasIncompatibleRegex) {
          return {
            runtime: middlewareConfig.runtime || "edge",
            matcher: [{ source: "/:path*" }]
          };
        }
        return {
          runtime: middlewareConfig.runtime || "edge",
          matcher: normalizedMatchers.map((item) => ({ source: item.source }))
        };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}
function updateEdgeFunctionsMetaJson(middlewareConfig) {
  const metaJsonPath = path.join(process.cwd(), ".edgeone/edge-functions/meta.json");
  let meta = { routes: [] };
  if (fs.existsSync(metaJsonPath)) {
    try {
      const content = fs.readFileSync(metaJsonPath, "utf-8");
      meta = JSON.parse(content);
    } catch (error) {
    }
  }
  if (middlewareConfig) {
    meta.middleware = middlewareConfig;
  }
  const edgeFunctionsDir = path.dirname(metaJsonPath);
  if (!fs.existsSync(edgeFunctionsDir)) {
    fs.mkdirSync(edgeFunctionsDir, { recursive: true });
  }
  fs.writeFileSync(metaJsonPath, JSON.stringify(meta, null, 2), "utf-8");
}
var convertNextRoutePattern = (path2) => {
  if (!path2.includes("[")) {
    return path2;
  }
  let convertedPath = path2;
  const optionalCatchAllMatch = path2.match(/\[\[\.\.\.([^\]]+)\]\]/);
  if (optionalCatchAllMatch) {
    const paramName = optionalCatchAllMatch[1];
    convertedPath = convertedPath.replace(/\[\[\.\.\.([^\]]+)\]\]/g, `:${paramName}*`);
  }
  const catchAllMatch = path2.match(/\[\.\.\.([^\]]+)\]/);
  if (catchAllMatch) {
    const paramName = catchAllMatch[1];
    convertedPath = convertedPath.replace(/\[\.\.\.([^\]]+)\]/g, `:${paramName}*`);
  }
  const dynamicMatch = path2.match(/\[([^\]]+)\]/);
  if (dynamicMatch) {
    const paramName = dynamicMatch[1];
    convertedPath = convertedPath.replace(/\[([^\]]+)\]/g, `:${paramName}`);
  }
  return convertedPath;
};
var createRouteMeta = async (ctx) => {
  const routeMap = {};
  const manifest = await ctx.getPrerenderManifest();
  if (manifest?.routes) {
    for (const [route, routeInfo] of Object.entries(manifest.routes)) {
      routeMap[route] = {
        // 提取关键信息到routeMap
        isStatic: routeInfo.initialRevalidateSeconds === false,
        initialRevalidateSeconds: routeInfo.initialRevalidateSeconds || void 0,
        srcRoute: routeInfo.srcRoute || void 0,
        dataRoute: routeInfo.dataRoute || void 0
      };
    }
  }
  const pagesManifest = await ctx.getPagesManifest();
  if (pagesManifest) {
    for (const [route, filePath] of Object.entries(pagesManifest)) {
      if (!routeMap[route]) {
        routeMap[route] = {};
      }
      if (filePath.startsWith("pages") && filePath.endsWith(".html")) {
        routeMap[route].isStatic = true;
      }
    }
  }
  const appPathRoutesManifest = await ctx.getAppPathRoutesManifest();
  if (appPathRoutesManifest) {
    for (const [route, actualRoute] of Object.entries(appPathRoutesManifest)) {
      if (!routeMap[actualRoute]) {
        routeMap[actualRoute] = {};
      }
    }
  }
  const routesManifest = await ctx.getRoutesManifest();
  if (routesManifest) {
    const dataRoutes = routesManifest.dataRoutes;
    if (dataRoutes) {
      for (const { page, dataRouteRegex } of dataRoutes) {
        routeMap[dataRouteRegex] = {
          isStatic: routeMap[page]?.isStatic || false
        };
      }
    }
  }
  const imagesManifest = await ctx.getImagesManifest();
  if (imagesManifest) {
    if (imagesManifest.images) {
      const imageConfig = imagesManifest.images;
      routeMap[imageConfig.path] = {};
    }
  }
  const convertedRouteMap = {};
  const pathsToDelete = [];
  for (const [routePath, routeConfig] of Object.entries(routeMap)) {
    const convertedPath = convertNextRoutePattern(routePath);
    if (convertedPath !== routePath) {
      pathsToDelete.push(routePath);
      convertedRouteMap[convertedPath] = routeConfig;
    }
  }
  for (const pathToDelete of pathsToDelete) {
    delete routeMap[pathToDelete];
  }
  Object.assign(routeMap, convertedRouteMap);
  const routesArray = Object.entries(routeMap).map(([path2, config]) => ({
    path: path2,
    ...config
  }));
  const serverHandlerDir = ctx.serverHandlerRootDir;
  if (!fs.existsSync(serverHandlerDir)) {
    fs.mkdirSync(serverHandlerDir, { recursive: true });
  }
  const metaFilePath = path.join(serverHandlerDir, "meta.json");
  const metaData = {
    nextRoutes: routesArray
  };
  fs.writeFileSync(
    metaFilePath,
    JSON.stringify(metaData, null, 2),
    "utf-8"
  );
  const middlewareConfig = await getMiddlewareConfig(ctx);
  updateEdgeFunctionsMetaJson(middlewareConfig);
};
export {
  convertNextRoutePattern,
  createRouteMeta
};
