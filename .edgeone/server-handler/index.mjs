
// ===== Fetch Proxy Injection (Production Mode Only) =====
// Inject fetch-proxy to intercept fetch calls
import __fetchProxyCrypto from 'node:crypto';

(function() {
  const __originalFetch = globalThis.fetch;

const uuid = '{{PAGES_PROXY_UUID}}';
const proxyHost = '{{PAGES_PROXY_HOST}}';

function _fetch(
  request,
  requestInit = {},
) {
  const { host } = getUrl(request);
  const cache = getHostCache(host);
  // if (cache && cache.needProxy && cache.expires > Date.now()) {
    setHostCache(host);
    return fetchByProxy(request, requestInit);
  // }
  // return fetchByOrigin(request, requestInit);
}

function getUrl(request) {
  const req = new Request(request);
  const url = new URL(req.url);
  return url;
}

function getHostCache(host) {
  return new Map(globalThis._FETCHCACHES || []).get(host);
}

function setHostCache(host) {
  const value = {
    needProxy: true,
    expires: Date.now() + 1000 * 60 * 60,
  };
  if (globalThis._FETCHCACHES) {
    globalThis._FETCHCACHES.set(host, value);
  } else {
    const cache = new Map([[host, value]]);
    Object.defineProperty(globalThis, '_FETCHCACHES', {
      value: cache,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }
}

function bufferToHex(arr) {
  return Array.prototype.map
    .call(arr, (x) => (x >= 16 ? x.toString(16) : '0' + x.toString(16)))
    .join('');
}

function generateSign({ pathname, oeTimestamp }) {
  return md5(oeTimestamp+'-'+pathname+'-'+uuid);
}

async function generateHeaders(request) {
  const { host, pathname } = getUrl(request);
  const timestamp = Date.now().toString();
  const sign = generateSign({ pathname, oeTimestamp: timestamp });
  return {
    host,
    timestamp,
    sign,
  };
}

// MD5 hash function for Node.js environment
// Node.js crypto.subtle.digest doesn't support MD5, so we use crypto.createHash instead
// Note: __fetchProxyCrypto is imported at the top level using ESM import
function md5(text) {
  const hash = __fetchProxyCrypto.createHash('md5');
  hash.update(text, 'utf8');
  return hash.digest('hex');
}

/**
 * 尝试通过原生fetch请求，如果失败，则通过代理请求
 * @returns
 */
async function fetchByOrigin(
  request,
  requestInit = {},
) {
  try {
    const res = await __originalFetch(request, {
      eo: {
        timeoutSetting: {
          connectTimeout: 500,
        },
      },
      ...requestInit,
    });
    if (res.status > 300 || res.status < 200) throw new Error('need proxy');
    return res;
  } catch (error) {
    const { host } = getUrl(request);
    setHostCache(host);
    return fetchByProxy(request, requestInit);
  }
}

/**
 * 通过 AI 代理请求
 * @returns
 */
async function fetchByProxy(
  request,
  requestInit,
) {
  const options = {};
  if (requestInit) {
    Object.assign(options, requestInit || {});
  }
  options.headers = new Headers(options.headers || {});
  const { host, timestamp, sign } = await generateHeaders(request);
  options.headers.append('oe-host', host);
  options.headers.append('oe-timestamp', timestamp);
  options.headers.append('oe-sign', sign);
  const originReq = new Request(request);
  const req = new Request(originReq.url.replace(host, proxyHost), {
    method: originReq.method,
    headers: originReq.headers,
    body: originReq.body,
  });
  return __originalFetch(req, options);
}
// Replace global fetch with _fetch from fetch-proxy
  if (typeof _fetch === 'function') {
    globalThis.fetch = _fetch;
    // Store original fetch for internal use
    globalThis.__originalFetch = __originalFetch;
  } else {
    console.warn('[runtime-shim] _fetch function not found, using original fetch');
  }
})();

import { createServer } from 'http';
import {
  createRequestContext,
  runWithRequestContext,
} from './netlify/my-app-latest/.edgeone/dist/run/handlers/request-context.cjs'
import { getTracer } from './netlify/my-app-latest/.edgeone/dist/run/handlers/tracer.cjs'
import * as serverHandler from './netlify/my-app-latest/.edgeone/dist/run/handlers/server.js'


process.chdir('./netlify/my-app-latest')

// Set feature flag for regional blobs
process.env.USE_REGIONAL_BLOBS = 'false'


async function handleResponse(res, response, passHeaders = {}) {
  const startTime = Date.now();
  
  // 没有响应 - 404 拦截
  if (!response) {
    const requestId = passHeaders['functions-request-id'] || '';
    res.writeHead(404, {
      'Functions-Request-Id': requestId,
      'eo-pages-inner-scf-status': '404',
      'eo-pages-inner-status-intercept': 'true'
    });
    res.end(JSON.stringify({
      error: "Not Found",
      message: "The requested path does not exist"
    }));
    const endTime = Date.now();
    console.log(`Pages response status: 404`);
    return;
  }

  try {
    if (response instanceof Response) {
      const requestId = passHeaders['functions-request-id'] || '';
      const responseStatus = response.status;
      
      const headers = Object.fromEntries(response.headers);
      Object.assign(headers, passHeaders);
      
      // 添加状态码区分的 headers
      headers['Functions-Request-Id'] = requestId;
      
      // 如果 Response 中已经设置了，使用它的值；否则使用 responseStatus
      if (!headers['eo-pages-inner-scf-status']) {
        headers['eo-pages-inner-scf-status'] = String(responseStatus);
      }
      
      // 如果 Response 中已经设置了，使用它的值；否则默认为 false
      if (!headers['eo-pages-inner-status-intercept']) {
        headers['eo-pages-inner-status-intercept'] = 'false';
      }
      
      if (response.headers.get('eop-client-geo')) {
        // 删除 eop-client-geo 头部
        response.headers.delete('eop-client-geo');
      }
      // 处理 set-cookie 头部
      if (response.headers.has('set-cookie')) {
        const cookieArr = response.headers.getSetCookie();
       
        headers['set-cookie'] = cookieArr;
      }
      // 检查是否是流式响应
      const isStream = response.body && (
        response.headers.get('content-type')?.includes('text/event-stream') ||
        response.headers.get('transfer-encoding')?.includes('chunked') ||
        response.body instanceof ReadableStream ||
        typeof response.body.pipe === 'function' ||
        response.headers.get('x-content-type-stream') === 'true'
      );

      if (isStream) {
        // 设置流式响应所需的头部
        const streamHeaders = {
          ...headers
        };

        if (response.headers.get('content-type')?.includes('text/event-stream')) {
          streamHeaders['Content-Type'] = 'text/event-stream';
        }

        res.writeHead(response.status, streamHeaders);

        if (typeof response.body.pipe === 'function') {
          response.body.pipe(res);
        } else {
          const reader = response.body.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
                res.write(value);
              } else {
                const chunk = new TextDecoder().decode(value);
                res.write(chunk);
              }
            }
          } finally {
            reader.releaseLock();
            res.end();
          }
        }
      } else {
        // 普通响应
        res.writeHead(response.status, headers);
        const body = await response.text();
        res.end(body);
      }
    } else {
      // 非 Response 对象，直接返回 JSON
      const requestId = passHeaders['functions-request-id'] || '';
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Functions-Request-Id': requestId,
        'eo-pages-inner-scf-status': '200',
        'eo-pages-inner-status-intercept': 'false'
      });
      res.end(JSON.stringify(response));
    }
  } catch (error) {
    // 用户函数内部错误 内部502 - 拦截
    const requestId = passHeaders['functions-request-id'] || '';
    res.writeHead(502, {
      'Functions-Request-Id': requestId,
      'eo-pages-inner-scf-status': '502',
      'eo-pages-inner-status-intercept': 'true'
    });
    res.end(JSON.stringify({
      error: "Internal Server Error",
      message: error.message
    }));
  } finally {
    const endTime = Date.now();
    console.log(`Pages response status: ${response?.status || 'unknown'}`);
  }
}


let cachedHandler
export default async function eoHandler (req, context) {
  const requestContext = createRequestContext(req, context)
  const tracer = getTracer()

  const handlerResponse = await runWithRequestContext(requestContext, () => {
    return tracer.withActiveSpan('Next.js Server Handler', async (span) => {
      if (!cachedHandler) {
        // const { default: handler } = await import('netlify/my-app-latest/.edgeone/dist/run/handlers/server.js')
        cachedHandler = serverHandler.default
      }
      const response = await cachedHandler(req, context, span, requestContext)
      return response
    })
  })

  return handlerResponse
}


export const config = {
  path: '/*',
  preferStatic: true,
};

const port = 9000;

// 实时流转换函数
function createReadableStreamFromRequest(req) {
  return new ReadableStream({
    start(controller) {
      req.on('data', chunk => {
        // 将Buffer转换为Uint8Array
        const uint8Array = new Uint8Array(chunk);
        controller.enqueue(uint8Array);
      });
      
      req.on('end', () => {
        controller.close();
      });
      
      req.on('error', error => {
        controller.error(error);
      });
    },
    
    cancel() {
      // 清理资源
      req.destroy();
    }
  });
}

const server = createServer(async (req, res) => {
  try {
    const requestStartTime = Date.now();
  
    // 构造 handler 需要的 req 对象（可根据需要扩展）
    const handlerReq = {
      ...req,
      headers: {
        ...req.headers,
        'accept-encoding': 'identity',
      },
      method: req.method,
      url: req.url,
    };

    // 读取 body（如果有）
    // let body = [];
    // req.on('data', chunk => body.push(chunk));
    // await new Promise(resolve => req.on('end', resolve));
    // if (body.length > 0) {
    //   handlerReq.body = Buffer.concat(body);
    // }

    handlerReq.body = createReadableStreamFromRequest(req);

    const response = await eoHandler(handlerReq, {});

    // response.headers.set('functions-request-id', req.headers['x-scf-request-id'] || '');

    const requestEndTime = Date.now();
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = url.pathname;

    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    let fullPath = '';
    if (req.headers.host === 'localhost:9000') {
      fullPath = pathname;
    } else {
      const host = req.headers['eo-pages-host'];
      const xForwardedProto = req.headers['x-forwarded-proto']; 

      fullPath = (xForwardedProto || 'https') + '://' + host + req.url;
      
      if (fullPath.endsWith('?')) {
        fullPath = fullPath.slice(0, -1);
      }
    }

    console.log(`Pages request path: ${fullPath}`);

    await handleResponse(res, response, {
      'functions-request-id': req.headers['x-scf-request-id'] || ''
    });
    return;
  } catch (error) {
    console.log(`Pages response status: 502`);
    // 用户函数内部错误 内部502 - 拦截
    const requestId = req.headers['x-scf-request-id'] || '';
    res.statusCode = 502;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Functions-Request-Id', requestId);
    res.setHeader('eo-pages-inner-scf-status', '502');
    res.setHeader('eo-pages-inner-status-intercept', 'true');
    res.end('<html><body><h1>Error</h1><p>'+error.message+'</p></body></html>');
  }
});

server.listen(port, () => {
  console.log('Server is running on http://localhost:9000');
});
  