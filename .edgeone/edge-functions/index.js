
      let global = globalThis;
      globalThis.global = globalThis;

      if (typeof global.navigator === 'undefined') {
        global.navigator = {
          userAgent: 'edge-runtime',
          language: 'en-US',
          languages: ['en-US'],
        };
      } else {
        if (typeof global.navigator.language === 'undefined') {
          global.navigator.language = 'en-US';
        }
        if (!global.navigator.languages || global.navigator.languages.length === 0) {
          global.navigator.languages = [global.navigator.language];
        }
        if (typeof global.navigator.userAgent === 'undefined') {
          global.navigator.userAgent = 'edge-runtime';
        }
      }

      class MessageChannel {
        constructor() {
          this.port1 = new MessagePort();
          this.port2 = new MessagePort();
        }
      }
      class MessagePort {
        constructor() {
          this.onmessage = null;
        }
        postMessage(data) {
          if (this.onmessage) {
            setTimeout(() => this.onmessage({ data }), 0);
          }
        }
      }
      global.MessageChannel = MessageChannel;

      // if ((typeof globalThis.fetch === 'undefined' || typeof globalThis.Headers === 'undefined' || typeof globalThis.Request === 'undefined' || typeof globalThis.Response === 'undefined') && typeof require !== 'undefined') {
      //   try {
      //     const undici = require('undici');
      //     if (undici.fetch && !globalThis.fetch) {
      //       globalThis.fetch = undici.fetch;
      //     }
      //     if (undici.Headers && typeof globalThis.Headers === 'undefined') {
      //       globalThis.Headers = undici.Headers;
      //     }
      //     if (undici.Request && typeof globalThis.Request === 'undefined') {
      //       globalThis.Request = undici.Request;
      //     }
      //     if (undici.Response && typeof globalThis.Response === 'undefined') {
      //       globalThis.Response = undici.Response;
      //     }
      //   } catch (polyfillError) {
      //     console.warn('Edge middleware polyfill failed:', polyfillError && polyfillError.message ? polyfillError.message : polyfillError);
      //   }
      // }

      '__MIDDLEWARE_BUNDLE_CODE__'

      function recreateRequest(request, overrides = {}) {
        const cloned = typeof request.clone === 'function' ? request.clone() : request;
        const headers = new Headers(cloned.headers);

        if (overrides.headerPatches) {
          Object.keys(overrides.headerPatches).forEach((key) => {
            const value = overrides.headerPatches[key];
            if (value === null || typeof value === 'undefined') {
              headers.delete(key);
            } else {
              headers.set(key, value);
            }
          });
        }

        if (overrides.headers) {
          const extraHeaders = new Headers(overrides.headers);
          extraHeaders.forEach((value, key) => headers.set(key, value));
        }

        const url = overrides.url || cloned.url;
        const method = overrides.method || cloned.method || 'GET';
        const canHaveBody = method && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD';
        const body = overrides.body !== undefined ? overrides.body : canHaveBody ? cloned.body : undefined;

        // 如果rewrite传入的是完整URL（第三方地址），需要更新host
        if (overrides.url) {
          try {
            const newUrl = new URL(overrides.url, cloned.url);
            // 只有当新URL是绝对路径（包含协议和host）时才更新host
            if (overrides.url.startsWith('http://') || overrides.url.startsWith('https://')) {
              headers.set('host', newUrl.host);
            }
            // 相对路径时保持原有host不变
          } catch (e) {
            // URL解析失败时保持原有host
          }
        }

        const init = {
          method,
          headers,
          redirect: cloned.redirect,
          credentials: cloned.credentials,
          cache: cloned.cache,
          mode: cloned.mode,
          referrer: cloned.referrer,
          referrerPolicy: cloned.referrerPolicy,
          integrity: cloned.integrity,
          keepalive: cloned.keepalive,
          signal: cloned.signal,
        };

        if (canHaveBody && body !== undefined) {
          init.body = body;
        }

        if ('duplex' in cloned) {
          init.duplex = cloned.duplex;
        }

        return new Request(url, init);

      }

      

      async function handleRequest(context){
        let routeParams = {};
        let pagesFunctionResponse = null;
        let request = context.request;
        const waitUntil = context.waitUntil;
        let urlInfo = new URL(request.url);
        const eo = request.eo || {};

        const normalizePathname = () => {
          if (urlInfo.pathname !== '/' && urlInfo.pathname.endsWith('/')) {
            urlInfo.pathname = urlInfo.pathname.slice(0, -1);
          }
        };

        function getSuffix(pathname = '') {
          // Use a regular expression to extract the file extension from the URL
          const suffix = pathname.match(/.([^.]+)$/);
          // If an extension is found, return it, otherwise return an empty string
          return suffix ? '.' + suffix[1] : null;
        }

        normalizePathname();

        let matchedFunc = false;

        
        const runEdgeFunctions = () => {
          
            if(!matchedFunc && '/basic/body' === urlInfo.pathname && request.method === 'POST') {
              matchedFunc = true;
                "use strict";
(() => {
  // edge-functions/basic/body.ts
  async function onRequestPost(context) {
    const { request } = context;
    try {
      console.log("=== Body Test ===");
      console.log("Method:", request.method);
      console.log("Content-Type:", request.headers["content-type"]);
      console.log("Content-Length:", request.headers["content-length"]);
      const body = request.body;
      return new Response(JSON.stringify(body), {
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }

          pagesFunctionResponse = onRequestPost;
        })();
            }
          

          if(!matchedFunc && '/basic/context' === urlInfo.pathname) {
            matchedFunc = true;
              "use strict";
(() => {
  // edge-functions/basic/context.ts
  var onRequest = async (context) => {
    const { request, params, server, clientIp, geo, uuid, env } = context;
    return new Response(
      JSON.stringify({ params, server, clientIp, geo, headers: context.request.headers, uuid, env })
    );
  };

        pagesFunctionResponse = onRequest;
      })();
          }
        

          if(!matchedFunc && '/basic/cookie' === urlInfo.pathname) {
            matchedFunc = true;
              "use strict";
(() => {
  // edge-functions/basic/cookie.ts
  async function onRequest(context) {
    const { request } = context;
    const cookies = request.cookies;
    return new Response(
      JSON.stringify(cookies),
      {
        status: 200
      }
    );
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        

          if(!matchedFunc && '/basic/hello' === urlInfo.pathname) {
            matchedFunc = true;
              "use strict";
(() => {
  // edge-functions/basic/hello.ts
  function onRequest(context) {
    return new Response("Hello, World from Edge Function!");
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        

          if(!matchedFunc && '/basic/methods' === urlInfo.pathname) {
            matchedFunc = true;
              "use strict";
(() => {
  // edge-functions/basic/methods.ts
  var onRequestGet = (context) => {
    return new Response(
      JSON.stringify({ "method": "GET" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "GET"
        }
      }
    );
  };
  var onRequestPost = (context) => {
    return new Response(
      JSON.stringify({ "method": "POST" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "POST"
        }
      }
    );
  };
  var onRequestPut = (context) => {
    return new Response(
      JSON.stringify({
        method: "PUT"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PUT"
        }
      }
    );
  };
  var onRequestPatch = (context) => {
    return new Response(
      JSON.stringify({
        method: "PATCH"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PATCH"
        }
      }
    );
  };
  var onRequestDelete = (context) => {
    return new Response(
      JSON.stringify({
        method: "DELETE"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "DELETE"
        }
      }
    );
  };
  var onRequestHead = (context) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Test-Method": "HEAD",
        "X-Custom-Header": "HEAD request successful",
        "X-Timestamp": (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  };
  var onRequestOptions = (context) => {
    return new Response(
      JSON.stringify({
        method: "OPTIONS"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      }
    );
  };
  var onRequest = (context) => {
    const method = context.request.method;
    return new Response(
      JSON.stringify({
        method: "FALLBACK"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "ALL",
          "X-Actual-Method": method
        }
      }
    );
  };

        pagesFunctionResponse = onRequest;
      })();
          }
        

            if(!matchedFunc && '/basic/methods' === urlInfo.pathname && request.method === 'GET') {
              matchedFunc = true;
                "use strict";
(() => {
  // edge-functions/basic/methods.ts
  var onRequestGet = (context) => {
    return new Response(
      JSON.stringify({ "method": "GET" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "GET"
        }
      }
    );
  };
  var onRequestPost = (context) => {
    return new Response(
      JSON.stringify({ "method": "POST" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "POST"
        }
      }
    );
  };
  var onRequestPut = (context) => {
    return new Response(
      JSON.stringify({
        method: "PUT"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PUT"
        }
      }
    );
  };
  var onRequestPatch = (context) => {
    return new Response(
      JSON.stringify({
        method: "PATCH"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PATCH"
        }
      }
    );
  };
  var onRequestDelete = (context) => {
    return new Response(
      JSON.stringify({
        method: "DELETE"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "DELETE"
        }
      }
    );
  };
  var onRequestHead = (context) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Test-Method": "HEAD",
        "X-Custom-Header": "HEAD request successful",
        "X-Timestamp": (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  };
  var onRequestOptions = (context) => {
    return new Response(
      JSON.stringify({
        method: "OPTIONS"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      }
    );
  };
  var onRequest = (context) => {
    const method = context.request.method;
    return new Response(
      JSON.stringify({
        method: "FALLBACK"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "ALL",
          "X-Actual-Method": method
        }
      }
    );
  };

          pagesFunctionResponse = onRequestGet;
        })();
            }
          

            if(!matchedFunc && '/basic/methods' === urlInfo.pathname && request.method === 'POST') {
              matchedFunc = true;
                "use strict";
(() => {
  // edge-functions/basic/methods.ts
  var onRequestGet = (context) => {
    return new Response(
      JSON.stringify({ "method": "GET" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "GET"
        }
      }
    );
  };
  var onRequestPost = (context) => {
    return new Response(
      JSON.stringify({ "method": "POST" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "POST"
        }
      }
    );
  };
  var onRequestPut = (context) => {
    return new Response(
      JSON.stringify({
        method: "PUT"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PUT"
        }
      }
    );
  };
  var onRequestPatch = (context) => {
    return new Response(
      JSON.stringify({
        method: "PATCH"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PATCH"
        }
      }
    );
  };
  var onRequestDelete = (context) => {
    return new Response(
      JSON.stringify({
        method: "DELETE"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "DELETE"
        }
      }
    );
  };
  var onRequestHead = (context) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Test-Method": "HEAD",
        "X-Custom-Header": "HEAD request successful",
        "X-Timestamp": (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  };
  var onRequestOptions = (context) => {
    return new Response(
      JSON.stringify({
        method: "OPTIONS"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      }
    );
  };
  var onRequest = (context) => {
    const method = context.request.method;
    return new Response(
      JSON.stringify({
        method: "FALLBACK"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "ALL",
          "X-Actual-Method": method
        }
      }
    );
  };

          pagesFunctionResponse = onRequestPost;
        })();
            }
          

            if(!matchedFunc && '/basic/methods' === urlInfo.pathname && request.method === 'DELETE') {
              matchedFunc = true;
                "use strict";
(() => {
  // edge-functions/basic/methods.ts
  var onRequestGet = (context) => {
    return new Response(
      JSON.stringify({ "method": "GET" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "GET"
        }
      }
    );
  };
  var onRequestPost = (context) => {
    return new Response(
      JSON.stringify({ "method": "POST" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "POST"
        }
      }
    );
  };
  var onRequestPut = (context) => {
    return new Response(
      JSON.stringify({
        method: "PUT"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PUT"
        }
      }
    );
  };
  var onRequestPatch = (context) => {
    return new Response(
      JSON.stringify({
        method: "PATCH"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PATCH"
        }
      }
    );
  };
  var onRequestDelete = (context) => {
    return new Response(
      JSON.stringify({
        method: "DELETE"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "DELETE"
        }
      }
    );
  };
  var onRequestHead = (context) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Test-Method": "HEAD",
        "X-Custom-Header": "HEAD request successful",
        "X-Timestamp": (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  };
  var onRequestOptions = (context) => {
    return new Response(
      JSON.stringify({
        method: "OPTIONS"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      }
    );
  };
  var onRequest = (context) => {
    const method = context.request.method;
    return new Response(
      JSON.stringify({
        method: "FALLBACK"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "ALL",
          "X-Actual-Method": method
        }
      }
    );
  };

          pagesFunctionResponse = onRequestDelete;
        })();
            }
          

            if(!matchedFunc && '/basic/methods' === urlInfo.pathname && request.method === 'PATCH') {
              matchedFunc = true;
                "use strict";
(() => {
  // edge-functions/basic/methods.ts
  var onRequestGet = (context) => {
    return new Response(
      JSON.stringify({ "method": "GET" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "GET"
        }
      }
    );
  };
  var onRequestPost = (context) => {
    return new Response(
      JSON.stringify({ "method": "POST" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "POST"
        }
      }
    );
  };
  var onRequestPut = (context) => {
    return new Response(
      JSON.stringify({
        method: "PUT"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PUT"
        }
      }
    );
  };
  var onRequestPatch = (context) => {
    return new Response(
      JSON.stringify({
        method: "PATCH"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PATCH"
        }
      }
    );
  };
  var onRequestDelete = (context) => {
    return new Response(
      JSON.stringify({
        method: "DELETE"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "DELETE"
        }
      }
    );
  };
  var onRequestHead = (context) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Test-Method": "HEAD",
        "X-Custom-Header": "HEAD request successful",
        "X-Timestamp": (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  };
  var onRequestOptions = (context) => {
    return new Response(
      JSON.stringify({
        method: "OPTIONS"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      }
    );
  };
  var onRequest = (context) => {
    const method = context.request.method;
    return new Response(
      JSON.stringify({
        method: "FALLBACK"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "ALL",
          "X-Actual-Method": method
        }
      }
    );
  };

          pagesFunctionResponse = onRequestPatch;
        })();
            }
          

            if(!matchedFunc && '/basic/methods' === urlInfo.pathname && request.method === 'PUT') {
              matchedFunc = true;
                "use strict";
(() => {
  // edge-functions/basic/methods.ts
  var onRequestGet = (context) => {
    return new Response(
      JSON.stringify({ "method": "GET" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "GET"
        }
      }
    );
  };
  var onRequestPost = (context) => {
    return new Response(
      JSON.stringify({ "method": "POST" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "POST"
        }
      }
    );
  };
  var onRequestPut = (context) => {
    return new Response(
      JSON.stringify({
        method: "PUT"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PUT"
        }
      }
    );
  };
  var onRequestPatch = (context) => {
    return new Response(
      JSON.stringify({
        method: "PATCH"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PATCH"
        }
      }
    );
  };
  var onRequestDelete = (context) => {
    return new Response(
      JSON.stringify({
        method: "DELETE"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "DELETE"
        }
      }
    );
  };
  var onRequestHead = (context) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Test-Method": "HEAD",
        "X-Custom-Header": "HEAD request successful",
        "X-Timestamp": (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  };
  var onRequestOptions = (context) => {
    return new Response(
      JSON.stringify({
        method: "OPTIONS"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      }
    );
  };
  var onRequest = (context) => {
    const method = context.request.method;
    return new Response(
      JSON.stringify({
        method: "FALLBACK"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "ALL",
          "X-Actual-Method": method
        }
      }
    );
  };

          pagesFunctionResponse = onRequestPut;
        })();
            }
          

            if(!matchedFunc && '/basic/methods' === urlInfo.pathname && request.method === 'HEAD') {
              matchedFunc = true;
                "use strict";
(() => {
  // edge-functions/basic/methods.ts
  var onRequestGet = (context) => {
    return new Response(
      JSON.stringify({ "method": "GET" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "GET"
        }
      }
    );
  };
  var onRequestPost = (context) => {
    return new Response(
      JSON.stringify({ "method": "POST" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "POST"
        }
      }
    );
  };
  var onRequestPut = (context) => {
    return new Response(
      JSON.stringify({
        method: "PUT"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PUT"
        }
      }
    );
  };
  var onRequestPatch = (context) => {
    return new Response(
      JSON.stringify({
        method: "PATCH"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PATCH"
        }
      }
    );
  };
  var onRequestDelete = (context) => {
    return new Response(
      JSON.stringify({
        method: "DELETE"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "DELETE"
        }
      }
    );
  };
  var onRequestHead = (context) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Test-Method": "HEAD",
        "X-Custom-Header": "HEAD request successful",
        "X-Timestamp": (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  };
  var onRequestOptions = (context) => {
    return new Response(
      JSON.stringify({
        method: "OPTIONS"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      }
    );
  };
  var onRequest = (context) => {
    const method = context.request.method;
    return new Response(
      JSON.stringify({
        method: "FALLBACK"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "ALL",
          "X-Actual-Method": method
        }
      }
    );
  };

          pagesFunctionResponse = onRequestHead;
        })();
            }
          

            if(!matchedFunc && '/basic/methods' === urlInfo.pathname && request.method === 'OPTIONS') {
              matchedFunc = true;
                "use strict";
(() => {
  // edge-functions/basic/methods.ts
  var onRequestGet = (context) => {
    return new Response(
      JSON.stringify({ "method": "GET" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "GET"
        }
      }
    );
  };
  var onRequestPost = (context) => {
    return new Response(
      JSON.stringify({ "method": "POST" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "POST"
        }
      }
    );
  };
  var onRequestPut = (context) => {
    return new Response(
      JSON.stringify({
        method: "PUT"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PUT"
        }
      }
    );
  };
  var onRequestPatch = (context) => {
    return new Response(
      JSON.stringify({
        method: "PATCH"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "PATCH"
        }
      }
    );
  };
  var onRequestDelete = (context) => {
    return new Response(
      JSON.stringify({
        method: "DELETE"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "DELETE"
        }
      }
    );
  };
  var onRequestHead = (context) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Test-Method": "HEAD",
        "X-Custom-Header": "HEAD request successful",
        "X-Timestamp": (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  };
  var onRequestOptions = (context) => {
    return new Response(
      JSON.stringify({
        method: "OPTIONS"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      }
    );
  };
  var onRequest = (context) => {
    const method = context.request.method;
    return new Response(
      JSON.stringify({
        method: "FALLBACK"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Method": "ALL",
          "X-Actual-Method": method
        }
      }
    );
  };

          pagesFunctionResponse = onRequestOptions;
        })();
            }
          

          if(!matchedFunc && '/basic/query' === urlInfo.pathname) {
            matchedFunc = true;
              "use strict";
(() => {
  // edge-functions/basic/query.ts
  async function onRequest(context) {
    const { request } = context;
    const query = request.query;
    return new Response(
      JSON.stringify(query),
      {
        status: 200
      }
    );
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        

          if(!matchedFunc && '/kv/test1' === urlInfo.pathname) {
            matchedFunc = true;
              "use strict";
(() => {
  // edge-functions/kv/test1.js
  async function onRequest(context) {
    return kv_test.get("heiheihei");
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        

          if(!matchedFunc && '/kv/test2' === urlInfo.pathname) {
            matchedFunc = true;
              "use strict";
(() => {
  // edge-functions/kv/test2.js
  async function onRequest(context) {
    return globalThis.kv_test.get("heiheihei");
  }

        pagesFunctionResponse = onRequest;
      })();
          }
        
        };
      

        
        const runMiddleware = typeof executeMiddleware !== 'undefined' ? executeMiddleware : async function() { return null; };
        let middlewareResponseHeaders = null; // 保存中间件设置的响应头
        const middlewareResponse = await runMiddleware({
          request,
          urlInfo: new URL(urlInfo.toString()),
          env: {"SECURITYSESSIONID":"186a4","MallocNanoZone":"0","USER":"vincentlli","__CFBundleIdentifier":"com.tencent.codebuddycn","COMMAND_MODE":"unix2003","PATH":"/Users/vincentlli/.codebuddy/bin:/Users/vincentlli/.local/state/fnm_multishells/89310_1770362811825/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin:/Users/vincentlli/Documents/demo/h265/emsdk:/Users/vincentlli/Documents/demo/h265/emsdk/upstream/emscripten:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Library/Apple/usr/bin:/Users/vincentlli/Documents/flutter/flutter/bin:/Users/vincentlli/Library/pnpm:/Users/vincentlli/.codebuddy/bin:/Users/vincentlli/.local/state/fnm_multishells/1286_1769839864637/bin:/Users/vincentlli/.deno/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/micromamba/condabin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin:/Users/vincentlli/.codebuddycn/extensions/ms-python.debugpy-2025.18.0-darwin-arm64/bundled/scripts/noConfigScripts","SHELL":"/bin/zsh","HOME":"/Users/vincentlli","LaunchInstanceID":"82092DCC-A44E-43D0-9C73-D5DAF266AC91","XPC_SERVICE_NAME":"0","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.HXUhZ6WMqI/Listeners","XPC_FLAGS":"0x0","LOGNAME":"vincentlli","TMPDIR":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/","__CF_USER_TEXT_ENCODING":"0x1F6:0x19:0x34","ORIGINAL_XDG_CURRENT_DESKTOP":"undefined","SHLVL":"1","PWD":"/Users/vincentlli/Documents/demo/netlify/my-app-latest","OLDPWD":"/Users/vincentlli/Documents/demo/netlify/my-app-latest/.edgeone","HOMEBREW_PREFIX":"/opt/homebrew","HOMEBREW_CELLAR":"/opt/homebrew/Cellar","HOMEBREW_REPOSITORY":"/opt/homebrew","INFOPATH":"/opt/homebrew/share/info:/opt/homebrew/share/info:","EMSDK":"/Users/vincentlli/Documents/demo/h265/emsdk","EMSDK_NODE":"/Users/vincentlli/Documents/demo/h265/emsdk/node/16.20.0_64bit/bin/node","EMSDK_PYTHON":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/bin/python3","SSL_CERT_FILE":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/lib/python3.9/site-packages/certifi/cacert.pem","NVM_DIR":"/Users/vincentlli/.nvm","NVM_CD_FLAGS":"-q","NVM_BIN":"/Users/vincentlli/.nvm/versions/node/v20.16.0/bin","NVM_INC":"/Users/vincentlli/.nvm/versions/node/v20.16.0/include/node","MAMBA_EXE":"/Users/vincentlli/.micromamba/bin/micromamba","MAMBA_ROOT_PREFIX":"/Users/vincentlli/micromamba","CONDA_SHLVL":"0","FNM_MULTISHELL_PATH":"/Users/vincentlli/.local/state/fnm_multishells/89310_1770362811825","FNM_VERSION_FILE_STRATEGY":"local","FNM_DIR":"/Users/vincentlli/.local/share/fnm","FNM_LOGLEVEL":"info","FNM_NODE_DIST_MIRROR":"https://nodejs.org/dist","FNM_COREPACK_ENABLED":"false","FNM_RESOLVE_ENGINES":"true","FNM_ARCH":"arm64","PNPM_HOME":"/Users/vincentlli/Library/pnpm","TERM_PROGRAM":"codebuddy","TERM_PROGRAM_VERSION":"1.100.0","LANG":"zh_CN.UTF-8","COLORTERM":"truecolor","GIT_ASKPASS":"/Applications/CodeBuddy CN.app/Contents/Resources/app/extensions/git/dist/askpass.sh","VSCODE_GIT_ASKPASS_NODE":"/Applications/CodeBuddy CN.app/Contents/Frameworks/CodeBuddy CN Helper (Plugin).app/Contents/MacOS/CodeBuddy CN Helper (Plugin)","VSCODE_GIT_ASKPASS_EXTRA_ARGS":"","VSCODE_GIT_ASKPASS_MAIN":"/Applications/CodeBuddy CN.app/Contents/Resources/app/extensions/git/dist/askpass-main.js","VSCODE_GIT_IPC_HANDLE":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/vscode-git-0c66ebf3cb.sock","PYDEVD_DISABLE_FILE_VALIDATION":"1","VSCODE_DEBUGPY_ADAPTER_ENDPOINTS":"/Users/vincentlli/.codebuddycn/extensions/ms-python.debugpy-2025.18.0-darwin-arm64/.noConfigDebugAdapterEndpoints/endpoint-cfe8ef53b91a3be0.txt","BUNDLED_DEBUGPY_PATH":"/Users/vincentlli/.codebuddycn/extensions/ms-python.debugpy-2025.18.0-darwin-arm64/bundled/libs/debugpy","PYTHONSTARTUP":"/Users/vincentlli/Library/Application Support/CodeBuddy CN/User/workspaceStorage/6afdedfc81868ff93fee6386b6e537e7/ms-python.python/pythonrc.py","PYTHON_BASIC_REPL":"1","VSCODE_INJECTION":"1","ZDOTDIR":"/Users/vincentlli","USER_ZDOTDIR":"/Users/vincentlli","TERM":"xterm-256color","VSCODE_PROFILE_INITIALIZED":"1","_":"/Users/vincentlli/.local/state/fnm_multishells/89310_1770362811825/bin/edgeone","XXX":"123","EDGEONE_MIDDLEWARE":"1","BETTER_AUTH_SECRET":"fLJB80TV0TIaxJkp7E1n4G0QlgeuOgAt","GITHUB_CLIENT_ID":"Ov23liFl3NADdBzGlJyK","GITHUB_CLIENT_SECRET":"07c93aa2c1193f2ae41dcff4ad080c6f3304025f","NEXT_PUBLIC_APP_URL":"https://test-v15-middleware-ai3phoqt.edgeone.cool","BETTER_AUTH_URL":"https://test-v15-middleware-ai3phoqt.edgeone.cool","NEXT_PRIVATE_STANDALONE":"true"},
          waitUntil
        });

        if (middlewareResponse) {
          const headers = middlewareResponse.headers;
          const hasNext = headers && headers.get('x-middleware-next') === '1';
          const rewriteTarget = headers && headers.get('x-middleware-rewrite');
          const requestHeadersOverride = headers && headers.get('x-middleware-request-headers');
          // Next.js 使用 x-middleware-override-headers 传递需要修改的请求头列表
          const overrideHeadersList = headers && headers.get('x-middleware-override-headers');

          if (rewriteTarget) {
            try {
              const rewrittenUrl = rewriteTarget.startsWith('http://') || rewriteTarget.startsWith('https://')
                ? rewriteTarget
                : new URL(rewriteTarget, urlInfo.origin).toString();
              request = recreateRequest(request, { url: rewrittenUrl });
              urlInfo = new URL(rewrittenUrl);
              normalizePathname();
            } catch (rewriteError) {
              console.error('Middleware rewrite error:', rewriteError);
            }
          }

          // 处理 Next.js 的 x-middleware-override-headers 机制
          if (overrideHeadersList) {
            try {
              const headerPatch = {};
              const overrideKeys = overrideHeadersList.split(',').map(k => k.trim());
              for (const key of overrideKeys) {
                const newValue = headers.get('x-middleware-request-' + key);
                if (newValue !== null) {
                  headerPatch[key] = newValue;
                }
              }
              if (Object.keys(headerPatch).length > 0) {
                request = recreateRequest(request, { headerPatches: headerPatch });
              }
            } catch (overrideError) {
              console.error('Middleware override headers error:', overrideError);
            }
          }
          // 处理旧的 x-middleware-request-headers 机制（兼容）
          else if (requestHeadersOverride) {
            try {
              const decoded = decodeURIComponent(requestHeadersOverride);
              const headerPatch = JSON.parse(decoded);
              request = recreateRequest(request, { headerPatches: headerPatch });
            } catch (requestPatchError) {
              console.error('Middleware request header override error:', requestPatchError);
            }
          }

          if (!hasNext && !rewriteTarget) {
            return middlewareResponse;
          }

          if (hasNext) {
            middlewareResponseHeaders = new Headers();
            const skipHeaders = new Set([
              'x-middleware-next',
              'x-middleware-rewrite',
              'x-middleware-request-headers',
              'x-middleware-override-headers',
              'x-middleware-set-cookie',
              'date',
              'connection',
              'content-length',
              'transfer-encoding',
              'set-cookie', // Set-Cookie 需要特殊处理，避免重复
            ]);
            headers.forEach((value, key) => {
              const lowerKey = key.toLowerCase();
              // 过滤内部使用的 header：skipHeaders 中的 + x-middleware-request-* 前缀的请求头修改标记
              if (!skipHeaders.has(lowerKey) && !lowerKey.startsWith('x-middleware-request-')) {
                middlewareResponseHeaders.set(key, value);
              }
            });
            // 特殊处理 Set-Cookie，可能有多个，使用 getSetCookie 获取完整的 cookie 值
            const setCookies = headers.getSetCookie ? headers.getSetCookie() : [];
            setCookies.forEach(cookie => {
              middlewareResponseHeaders.append('Set-Cookie', cookie);
            });
          }
        }
      
        
        // 走到这里说明：
        // 1. 没有中间件响应（middlewareResponse 为 null/undefined）
        // 2. 或者中间件返回了 next
        // 需要判断是否命中边缘函数

        runEdgeFunctions();

        //没有命中边缘函数，执行回源
        if (!matchedFunc) {
          // 允许压缩的文件后缀白名单
          const ALLOW_COMPRESS_SUFFIXES = [
            '.html', '.htm', '.xml', '.txt', '.text', '.conf', '.def', '.list', '.log', '.in',
            '.css', '.js', '.json', '.rss', '.svg', '.tif', '.tiff', '.rtx', '.htc',
            '.java', '.md', '.markdown', '.ico', '.pl', '.pm', '.cgi', '.pb', '.proto',
            '.xhtml', '.xht', '.ttf', '.otf', '.woff', '.eot', '.wasm', '.binast', '.webmanifest'
          ];
          
          // 检查请求路径是否有允许压缩的后缀
          const pathname = urlInfo.pathname;
          const suffix = getSuffix(pathname);
          const hasCompressibleSuffix = ALLOW_COMPRESS_SUFFIXES.includes(suffix);
          
          // 如果不是可压缩的文件类型，删除 Accept-Encoding 头以禁用 CDN 压缩
          if (!hasCompressibleSuffix) {
              request.headers.delete('accept-encoding');
          }
          
          const originResponse = await fetch(request);
          
          // 如果中间件设置了响应头，合并到回源响应中
          if (middlewareResponseHeaders) {
            const mergedHeaders = new Headers(originResponse.headers);
            // 删除可能导致问题的编码相关头
            mergedHeaders.delete('content-encoding');
            mergedHeaders.delete('content-length');
            middlewareResponseHeaders.forEach((value, key) => {
              if (key.toLowerCase() === 'set-cookie') {
                mergedHeaders.append(key, value);
              } else {
                mergedHeaders.set(key, value);
              }
            });
            return new Response(originResponse.body, {
              status: originResponse.status,
              statusText: originResponse.statusText,
              headers: mergedHeaders,
            });
          }
          
          return originResponse;
        }
        
        // 命中了边缘函数，继续执行边缘函数逻辑

        const params = {};
        if (routeParams.id) {
          if (routeParams.mode === 1) {
            const value = urlInfo.pathname.match(routeParams.left);        
            for (let i = 1; i < value.length; i++) {
              params[routeParams.id[i - 1]] = value[i];
            }
          } else {
            const value = urlInfo.pathname.replace(routeParams.left, '');
            const splitedValue = value.split('/');
            if (splitedValue.length === 1) {
              params[routeParams.id] = splitedValue[0];
            } else {
              params[routeParams.id] = splitedValue;
            }
          }
          
        }
        const edgeFunctionResponse = await pagesFunctionResponse({request, params, env: {"SECURITYSESSIONID":"186a4","MallocNanoZone":"0","USER":"vincentlli","__CFBundleIdentifier":"com.tencent.codebuddycn","COMMAND_MODE":"unix2003","PATH":"/Users/vincentlli/.codebuddy/bin:/Users/vincentlli/.local/state/fnm_multishells/89310_1770362811825/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin:/Users/vincentlli/Documents/demo/h265/emsdk:/Users/vincentlli/Documents/demo/h265/emsdk/upstream/emscripten:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Library/Apple/usr/bin:/Users/vincentlli/Documents/flutter/flutter/bin:/Users/vincentlli/Library/pnpm:/Users/vincentlli/.codebuddy/bin:/Users/vincentlli/.local/state/fnm_multishells/1286_1769839864637/bin:/Users/vincentlli/.deno/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/micromamba/condabin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin:/Users/vincentlli/.codebuddycn/extensions/ms-python.debugpy-2025.18.0-darwin-arm64/bundled/scripts/noConfigScripts","SHELL":"/bin/zsh","HOME":"/Users/vincentlli","LaunchInstanceID":"82092DCC-A44E-43D0-9C73-D5DAF266AC91","XPC_SERVICE_NAME":"0","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.HXUhZ6WMqI/Listeners","XPC_FLAGS":"0x0","LOGNAME":"vincentlli","TMPDIR":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/","__CF_USER_TEXT_ENCODING":"0x1F6:0x19:0x34","ORIGINAL_XDG_CURRENT_DESKTOP":"undefined","SHLVL":"1","PWD":"/Users/vincentlli/Documents/demo/netlify/my-app-latest","OLDPWD":"/Users/vincentlli/Documents/demo/netlify/my-app-latest/.edgeone","HOMEBREW_PREFIX":"/opt/homebrew","HOMEBREW_CELLAR":"/opt/homebrew/Cellar","HOMEBREW_REPOSITORY":"/opt/homebrew","INFOPATH":"/opt/homebrew/share/info:/opt/homebrew/share/info:","EMSDK":"/Users/vincentlli/Documents/demo/h265/emsdk","EMSDK_NODE":"/Users/vincentlli/Documents/demo/h265/emsdk/node/16.20.0_64bit/bin/node","EMSDK_PYTHON":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/bin/python3","SSL_CERT_FILE":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/lib/python3.9/site-packages/certifi/cacert.pem","NVM_DIR":"/Users/vincentlli/.nvm","NVM_CD_FLAGS":"-q","NVM_BIN":"/Users/vincentlli/.nvm/versions/node/v20.16.0/bin","NVM_INC":"/Users/vincentlli/.nvm/versions/node/v20.16.0/include/node","MAMBA_EXE":"/Users/vincentlli/.micromamba/bin/micromamba","MAMBA_ROOT_PREFIX":"/Users/vincentlli/micromamba","CONDA_SHLVL":"0","FNM_MULTISHELL_PATH":"/Users/vincentlli/.local/state/fnm_multishells/89310_1770362811825","FNM_VERSION_FILE_STRATEGY":"local","FNM_DIR":"/Users/vincentlli/.local/share/fnm","FNM_LOGLEVEL":"info","FNM_NODE_DIST_MIRROR":"https://nodejs.org/dist","FNM_COREPACK_ENABLED":"false","FNM_RESOLVE_ENGINES":"true","FNM_ARCH":"arm64","PNPM_HOME":"/Users/vincentlli/Library/pnpm","TERM_PROGRAM":"codebuddy","TERM_PROGRAM_VERSION":"1.100.0","LANG":"zh_CN.UTF-8","COLORTERM":"truecolor","GIT_ASKPASS":"/Applications/CodeBuddy CN.app/Contents/Resources/app/extensions/git/dist/askpass.sh","VSCODE_GIT_ASKPASS_NODE":"/Applications/CodeBuddy CN.app/Contents/Frameworks/CodeBuddy CN Helper (Plugin).app/Contents/MacOS/CodeBuddy CN Helper (Plugin)","VSCODE_GIT_ASKPASS_EXTRA_ARGS":"","VSCODE_GIT_ASKPASS_MAIN":"/Applications/CodeBuddy CN.app/Contents/Resources/app/extensions/git/dist/askpass-main.js","VSCODE_GIT_IPC_HANDLE":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/vscode-git-0c66ebf3cb.sock","PYDEVD_DISABLE_FILE_VALIDATION":"1","VSCODE_DEBUGPY_ADAPTER_ENDPOINTS":"/Users/vincentlli/.codebuddycn/extensions/ms-python.debugpy-2025.18.0-darwin-arm64/.noConfigDebugAdapterEndpoints/endpoint-cfe8ef53b91a3be0.txt","BUNDLED_DEBUGPY_PATH":"/Users/vincentlli/.codebuddycn/extensions/ms-python.debugpy-2025.18.0-darwin-arm64/bundled/libs/debugpy","PYTHONSTARTUP":"/Users/vincentlli/Library/Application Support/CodeBuddy CN/User/workspaceStorage/6afdedfc81868ff93fee6386b6e537e7/ms-python.python/pythonrc.py","PYTHON_BASIC_REPL":"1","VSCODE_INJECTION":"1","ZDOTDIR":"/Users/vincentlli","USER_ZDOTDIR":"/Users/vincentlli","TERM":"xterm-256color","VSCODE_PROFILE_INITIALIZED":"1","_":"/Users/vincentlli/.local/state/fnm_multishells/89310_1770362811825/bin/edgeone","XXX":"123","EDGEONE_MIDDLEWARE":"1","BETTER_AUTH_SECRET":"fLJB80TV0TIaxJkp7E1n4G0QlgeuOgAt","GITHUB_CLIENT_ID":"Ov23liFl3NADdBzGlJyK","GITHUB_CLIENT_SECRET":"07c93aa2c1193f2ae41dcff4ad080c6f3304025f","NEXT_PUBLIC_APP_URL":"https://test-v15-middleware-ai3phoqt.edgeone.cool","BETTER_AUTH_URL":"https://test-v15-middleware-ai3phoqt.edgeone.cool","NEXT_PRIVATE_STANDALONE":"true"}, waitUntil, eo });
        
        // 如果中间件设置了响应头，合并到边缘函数响应中
        if (middlewareResponseHeaders && edgeFunctionResponse) {
          const mergedHeaders = new Headers(edgeFunctionResponse.headers);
          // 删除可能导致问题的编码相关头
          mergedHeaders.delete('content-encoding');
          mergedHeaders.delete('content-length');
          middlewareResponseHeaders.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
              mergedHeaders.append(key, value);
            } else {
              mergedHeaders.set(key, value);
            }
          });
          return new Response(edgeFunctionResponse.body, {
            status: edgeFunctionResponse.status,
            statusText: edgeFunctionResponse.statusText,
            headers: mergedHeaders,
          });
        }
        
        return edgeFunctionResponse;
      }
      addEventListener('fetch', event=>{return event.respondWith(handleRequest({request:event.request,params: {}, env: {"SECURITYSESSIONID":"186a4","MallocNanoZone":"0","USER":"vincentlli","__CFBundleIdentifier":"com.tencent.codebuddycn","COMMAND_MODE":"unix2003","PATH":"/Users/vincentlli/.codebuddy/bin:/Users/vincentlli/.local/state/fnm_multishells/89310_1770362811825/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin:/Users/vincentlli/Documents/demo/h265/emsdk:/Users/vincentlli/Documents/demo/h265/emsdk/upstream/emscripten:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Library/Apple/usr/bin:/Users/vincentlli/Documents/flutter/flutter/bin:/Users/vincentlli/Library/pnpm:/Users/vincentlli/.codebuddy/bin:/Users/vincentlli/.local/state/fnm_multishells/1286_1769839864637/bin:/Users/vincentlli/.deno/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/micromamba/condabin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin:/Users/vincentlli/.codebuddycn/extensions/ms-python.debugpy-2025.18.0-darwin-arm64/bundled/scripts/noConfigScripts","SHELL":"/bin/zsh","HOME":"/Users/vincentlli","LaunchInstanceID":"82092DCC-A44E-43D0-9C73-D5DAF266AC91","XPC_SERVICE_NAME":"0","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.HXUhZ6WMqI/Listeners","XPC_FLAGS":"0x0","LOGNAME":"vincentlli","TMPDIR":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/","__CF_USER_TEXT_ENCODING":"0x1F6:0x19:0x34","ORIGINAL_XDG_CURRENT_DESKTOP":"undefined","SHLVL":"1","PWD":"/Users/vincentlli/Documents/demo/netlify/my-app-latest","OLDPWD":"/Users/vincentlli/Documents/demo/netlify/my-app-latest/.edgeone","HOMEBREW_PREFIX":"/opt/homebrew","HOMEBREW_CELLAR":"/opt/homebrew/Cellar","HOMEBREW_REPOSITORY":"/opt/homebrew","INFOPATH":"/opt/homebrew/share/info:/opt/homebrew/share/info:","EMSDK":"/Users/vincentlli/Documents/demo/h265/emsdk","EMSDK_NODE":"/Users/vincentlli/Documents/demo/h265/emsdk/node/16.20.0_64bit/bin/node","EMSDK_PYTHON":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/bin/python3","SSL_CERT_FILE":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/lib/python3.9/site-packages/certifi/cacert.pem","NVM_DIR":"/Users/vincentlli/.nvm","NVM_CD_FLAGS":"-q","NVM_BIN":"/Users/vincentlli/.nvm/versions/node/v20.16.0/bin","NVM_INC":"/Users/vincentlli/.nvm/versions/node/v20.16.0/include/node","MAMBA_EXE":"/Users/vincentlli/.micromamba/bin/micromamba","MAMBA_ROOT_PREFIX":"/Users/vincentlli/micromamba","CONDA_SHLVL":"0","FNM_MULTISHELL_PATH":"/Users/vincentlli/.local/state/fnm_multishells/89310_1770362811825","FNM_VERSION_FILE_STRATEGY":"local","FNM_DIR":"/Users/vincentlli/.local/share/fnm","FNM_LOGLEVEL":"info","FNM_NODE_DIST_MIRROR":"https://nodejs.org/dist","FNM_COREPACK_ENABLED":"false","FNM_RESOLVE_ENGINES":"true","FNM_ARCH":"arm64","PNPM_HOME":"/Users/vincentlli/Library/pnpm","TERM_PROGRAM":"codebuddy","TERM_PROGRAM_VERSION":"1.100.0","LANG":"zh_CN.UTF-8","COLORTERM":"truecolor","GIT_ASKPASS":"/Applications/CodeBuddy CN.app/Contents/Resources/app/extensions/git/dist/askpass.sh","VSCODE_GIT_ASKPASS_NODE":"/Applications/CodeBuddy CN.app/Contents/Frameworks/CodeBuddy CN Helper (Plugin).app/Contents/MacOS/CodeBuddy CN Helper (Plugin)","VSCODE_GIT_ASKPASS_EXTRA_ARGS":"","VSCODE_GIT_ASKPASS_MAIN":"/Applications/CodeBuddy CN.app/Contents/Resources/app/extensions/git/dist/askpass-main.js","VSCODE_GIT_IPC_HANDLE":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/vscode-git-0c66ebf3cb.sock","PYDEVD_DISABLE_FILE_VALIDATION":"1","VSCODE_DEBUGPY_ADAPTER_ENDPOINTS":"/Users/vincentlli/.codebuddycn/extensions/ms-python.debugpy-2025.18.0-darwin-arm64/.noConfigDebugAdapterEndpoints/endpoint-cfe8ef53b91a3be0.txt","BUNDLED_DEBUGPY_PATH":"/Users/vincentlli/.codebuddycn/extensions/ms-python.debugpy-2025.18.0-darwin-arm64/bundled/libs/debugpy","PYTHONSTARTUP":"/Users/vincentlli/Library/Application Support/CodeBuddy CN/User/workspaceStorage/6afdedfc81868ff93fee6386b6e537e7/ms-python.python/pythonrc.py","PYTHON_BASIC_REPL":"1","VSCODE_INJECTION":"1","ZDOTDIR":"/Users/vincentlli","USER_ZDOTDIR":"/Users/vincentlli","TERM":"xterm-256color","VSCODE_PROFILE_INITIALIZED":"1","_":"/Users/vincentlli/.local/state/fnm_multishells/89310_1770362811825/bin/edgeone","XXX":"123","EDGEONE_MIDDLEWARE":"1","BETTER_AUTH_SECRET":"fLJB80TV0TIaxJkp7E1n4G0QlgeuOgAt","GITHUB_CLIENT_ID":"Ov23liFl3NADdBzGlJyK","GITHUB_CLIENT_SECRET":"07c93aa2c1193f2ae41dcff4ad080c6f3304025f","NEXT_PUBLIC_APP_URL":"https://test-v15-middleware-ai3phoqt.edgeone.cool","BETTER_AUTH_URL":"https://test-v15-middleware-ai3phoqt.edgeone.cool","NEXT_PRIVATE_STANDALONE":"true"}, waitUntil: event.waitUntil }))});