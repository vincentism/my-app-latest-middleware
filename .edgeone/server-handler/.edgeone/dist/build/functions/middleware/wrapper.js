
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    
import "../../../esm-chunks/chunk-6BT4RYQJ.js";

// src/build/functions/middleware/wrapper.ts
function getEdgeOneWrapperCode(options = {}) {
  const {
    middlewareEntry = "middleware_src/middleware",
    debug = false,
    isRawSource = false
  } = options;
  const isProxyFormat = middlewareEntry.includes("proxy");
  const functionName = isProxyFormat ? "proxy" : "middleware";
  if (isRawSource) {
    return `
// ============================================================
// Middleware Runner (Raw Source Mode)
// ============================================================

/**
 * \u8FD0\u884C\u4E2D\u95F4\u4EF6\u7684\u4E3B\u51FD\u6570
 * @param {Request} request - \u539F\u59CB\u8BF7\u6C42\u5BF9\u8C61
 * @returns {Promise<any>} - middleware \u51FD\u6570\u7684\u539F\u59CB\u8FD4\u56DE\u503C
 */
async function executeMiddleware({request}) {
  // \u68C0\u67E5 middleware \u51FD\u6570\u662F\u5426\u5B58\u5728
  if (typeof middleware !== 'function') {
    throw new Error('middleware function not found');
  }

  // \u68C0\u67E5\u8DEF\u5F84\u5339\u914D\uFF08\u5982\u679C\u6709 config.matcher\uFF09
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  if (typeof config !== 'undefined' && config.matcher) {
    const matchers = Array.isArray(config.matcher) ? config.matcher : [config.matcher];
    
    let matched = false;
    for (const pattern of matchers) {
      if (typeof pattern === 'string') {
        if (pattern === pathname) {
          matched = true;
          break;
        }
        try {
          let regexPattern = pattern
            .replace(/\\./g, '\\\\.')
            .replace(/\\/:([^/]+)\\*/g, '(?:/.*)?')
            .replace(/\\/:([^/]+)/g, '/[^/]+')
            .replace(/\\/\\*\\*/g, '/.*')
            .replace(/\\/\\*/g, '/[^/]*')
            .replace(/^\\((.+)\\)$/, '$1');
          
          if (!regexPattern.startsWith('^')) {
            regexPattern = '^' + regexPattern;
          }
          if (!regexPattern.endsWith('$')) {
            regexPattern = regexPattern + '(?:/.*)?$';
          }
          
          if (new RegExp(regexPattern).test(pathname)) {
            matched = true;
            break;
          }
        } catch (e) {
          // Regex error, skip this pattern
        }
      }
    }
    
    if (!matched) {
      return null;
    }
  }

  // \u4E3A request \u6DFB\u52A0 nextUrl \u5C5E\u6027
  if (!request.nextUrl) {
    Object.defineProperty(request, 'nextUrl', {
      value: {
        pathname: pathname,
        search: url.search,
        searchParams: url.searchParams,
        hash: url.hash,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        protocol: url.protocol,
        href: url.href,
        origin: url.origin,
        basePath: '',
        locale: '',
        defaultLocale: '',
        toString: () => url.href,
        clone: () => new URL(url.href)
      },
      writable: true,
      enumerable: true
    });
  }

  // \u4E3A request \u6DFB\u52A0 cookies \u5C5E\u6027
  if (!request.cookies) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieMap = new Map();
    
    if (cookieHeader) {
      cookieHeader.split(';').forEach(cookie => {
        const [name, ...valueParts] = cookie.trim().split('=');
        if (name) {
          cookieMap.set(name.trim(), { 
            name: name.trim(), 
            value: valueParts.join('=') || '' 
          });
        }
      });
    }
    
    Object.defineProperty(request, 'cookies', {
      value: {
        get: (name) => cookieMap.get(name),
        has: (name) => cookieMap.has(name),
        getAll: () => Array.from(cookieMap.values()),
        set: () => {},
        delete: () => {},
        clear: () => {},
        [Symbol.iterator]: () => cookieMap.values(),
        size: cookieMap.size
      },
      writable: true,
      enumerable: true
    });
  }

  // \u8C03\u7528 middleware \u51FD\u6570
  const result = await middleware(request);

  return result;
}
`;
  }
  return `
// ============================================================
// Middleware Runner (Webpack Bundle Mode)
// ============================================================

/**
 * \u4ECE _ENTRIES \u83B7\u53D6 ${functionName} \u51FD\u6570
 */
async function getMiddleware() {
  const entry = _ENTRIES['${middlewareEntry}'];
  ${debug ? "console.log('[getMiddleware] entry:', entry, 'type:', typeof entry);" : ""}
  
  if (!entry) {
    throw new Error('Entry not found: ${middlewareEntry}. Available entries: ' + Object.keys(_ENTRIES).join(', '));
  }
  
  let handler;
  
  if (entry.default !== undefined) {
    handler = entry.default;
  } else if (typeof entry === 'function') {
    handler = entry;
  } else if ('proxy' in entry) {
    handler = entry.proxy;
  } else if ('middleware' in entry) {
    handler = entry.middleware;
  } else {
    for (const key of Object.keys(entry)) {
      if (typeof entry[key] === 'function') {
        handler = entry[key];
        break;
      }
    }
  }
  
  if (handler && typeof handler.then === 'function') {
    handler = await handler;
  }
  
  if (typeof handler !== 'function') {
    throw new Error('Handler is not a function. Type: ' + typeof handler);
  }
  
  return handler;
}

/**
 * \u83B7\u53D6 middleware \u914D\u7F6E
 */
function getMiddlewareConfig() {
  const entry = _ENTRIES['${middlewareEntry}'];
  return entry?.config || {};
}

/**
 * \u68C0\u67E5 URL \u662F\u5426\u5339\u914D matcher \u89C4\u5219
 * 
 * Next.js matcher \u652F\u6301\u4E24\u79CD\u683C\u5F0F\uFF1A
 * 1. \u8DEF\u5F84\u6A21\u5F0F\uFF1A\u5982 /dashboard/:path*\uFF0C\u9700\u8981\u8F6C\u6362\u4E3A\u6B63\u5219
 * 2. \u6B63\u5219\u8868\u8FBE\u5F0F\uFF1A\u5982 /((?!api|_next/static).*)\uFF0C\u76F4\u63A5\u4F7F\u7528
 */
function matchesPath(pathname, matcher) {
  if (!matcher) return true;
  
  const matchers = Array.isArray(matcher) ? matcher : [matcher];
  
  for (const pattern of matchers) {
    if (typeof pattern === 'string') {
      let regex;
      
      // \u68C0\u6D4B\u662F\u5426\u662F\u6B63\u5219\u8868\u8FBE\u5F0F\u683C\u5F0F
      // \u6B63\u5219\u8868\u8FBE\u5F0F\u901A\u5E38\u5305\u542B (?! (?= (?:  \u7B49\u7279\u6B8A\u8BED\u6CD5
      // \u4F7F\u7528\u5B57\u7B26\u4E32\u65B9\u6CD5\u907F\u514D\u6B63\u5219\u8F6C\u4E49\u95EE\u9898
      const isRegexPattern = pattern.includes('(?') || pattern.includes('[^') || pattern.includes('.*') || pattern.endsWith('$');
      
      if (isRegexPattern) {
        // \u76F4\u63A5\u4F5C\u4E3A\u6B63\u5219\u8868\u8FBE\u5F0F\u4F7F\u7528
        try {
          regex = new RegExp('^' + pattern + '$');
        } catch (e) {
          console.warn('[Middleware] Invalid regex pattern:', pattern, e);
          continue;
        }
      } else {
        // \u8DEF\u5F84\u6A21\u5F0F\uFF0C\u9700\u8981\u8F6C\u6362
        // /dashboard/:path* -> /dashboard/.*
        // /api/:path -> /api/[^/]+
        // \u4F7F\u7528 split/join \u66FF\u4EE3\u6B63\u5219\uFF0C\u907F\u514D\u8F6C\u4E49\u95EE\u9898
        let regexPattern = pattern;
        
        // \u8F6C\u4E49\u659C\u6760: / -> /
        regexPattern = regexPattern.split('/').join('\\/');
        
        // :path* -> .*
        // :path -> [^/]+
        // \u5148\u5904\u7406 :xxx* \u518D\u5904\u7406 :xxx
        const parts = regexPattern.split(':');
        regexPattern = parts[0];
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];
          // \u627E\u5230\u53C2\u6570\u540D\u7ED3\u675F\u4F4D\u7F6E
          let j = 0;
          while (j < part.length && /[a-zA-Z0-9_]/.test(part[j])) {
            j++;
          }
          if (j < part.length && part[j] === '*') {
            // :path* -> .*
            regexPattern += '.*' + part.slice(j + 1);
          } else {
            // :path -> [^/]+
            regexPattern += '[^/]+' + part.slice(j);
          }
        }
        
        // ** -> .*
        regexPattern = regexPattern.split('**').join('.*');
        // * -> [^/]* (\u4F46\u4E0D\u5F71\u54CD\u5DF2\u7ECF\u8F6C\u6362\u7684 .*)
        // \u7B80\u5355\u5904\u7406\uFF1A\u53EA\u66FF\u6362\u72EC\u7ACB\u7684 *
        regexPattern = regexPattern.split('\\*').join('[^/]*');
        
        regex = new RegExp('^' + regexPattern + '$');
      }
      
      if (regex.test(pathname)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * \u8FD0\u884C\u4E2D\u95F4\u4EF6\u7684\u4E3B\u51FD\u6570
 * @param {Request} request - \u539F\u59CB\u8BF7\u6C42\u5BF9\u8C61
 * @returns {Promise<any>} - middleware \u51FD\u6570\u7684\u539F\u59CB\u8FD4\u56DE\u503C
 */
async function executeMiddleware({request}) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // \u83B7\u53D6 middleware \u914D\u7F6E\u5E76\u68C0\u67E5\u662F\u5426\u5339\u914D
  const config = getMiddlewareConfig();
  if (!matchesPath(pathname, config.matcher)) {
    return null;
  }

  // \u83B7\u53D6 middleware \u51FD\u6570
  const middlewareFn = await getMiddleware();
  
  // \u5C06\u539F\u59CB Headers \u8F6C\u6362\u4E3A\u666E\u901A\u5BF9\u8C61\u683C\u5F0F
  // Next.js adapter \u5185\u90E8\u7684 fromNodeOutgoingHttpHeaders \u671F\u671B\u5BF9\u8C61\u683C\u5F0F
  const headersObject = {};
  request.headers.forEach((value, key) => {
    headersObject[key] = value;
  });
  
  // \u6784\u9020 Next.js middleware adapter \u671F\u671B\u7684\u53C2\u6570\u683C\u5F0F
  // \u53C2\u8003 Next.js \u6E90\u7801\u4E2D\u7684 adapter \u51FD\u6570
  const middlewareParams = {
    request: {
      url: request.url,
      method: request.method,
      headers: headersObject,
      body: request.body,
      nextConfig: {
        basePath: '',
        i18n: null,
        trailingSlash: false
      },
      geo: {},
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      signal: request.signal || null
    },
    page: '/',
    // \u6DFB\u52A0 waitUntil \u65B9\u6CD5
    waitUntil: (promise) => {}
  };

  const result = await middlewareFn(middlewareParams);

  // Webpack \u6A21\u5F0F\u8FD4\u56DE\u7684\u662F { response: Response, waitUntil: {} } \u683C\u5F0F
  // \u9700\u8981\u63D0\u53D6\u5B9E\u9645\u7684 Response \u5BF9\u8C61
  let finalResponse = result;
  if (result && typeof result === 'object' && !(result instanceof Response)) {
    if (result.response && result.response instanceof Response) {
      finalResponse = result.response;
    }
  }

  return finalResponse;
}
`;
}
export {
  getEdgeOneWrapperCode
};
