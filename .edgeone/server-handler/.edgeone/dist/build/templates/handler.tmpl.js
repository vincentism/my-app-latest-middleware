
import { createServer } from 'http';
import {
  createRequestContext,
  runWithRequestContext,
} from './.edgeone/dist/run/handlers/request-context.cjs';
import serverHandler from './.edgeone/dist/run/handlers/server.js';
import { getTracer } from './.edgeone/dist/run/handlers/tracer.cjs';


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
        
        // 删除内部 header
        if (response.headers.get('eop-client-geo')) {
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
              // scf可能会立即冻结环境上下文，导致后续日志无法输出，通过延时来确保日志输出
              setTimeout(() => {
                res.end();
              }, 1);
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
  

process.env.USE_REGIONAL_BLOBS = 'true';
export default async function handler(req, context) {
  const requestContext = createRequestContext(req, context);
  const tracer = getTracer();

  const handlerResponse = await runWithRequestContext(requestContext, () => {
    return tracer.withActiveSpan('Next.js Server Handler', async (span) => {
      const response = await serverHandler(req, context, span, requestContext);
      return response;
    });
  });

  if (requestContext.serverTiming) {
    handlerResponse.headers.set('server-timing', requestContext.serverTiming);
  }

  return handlerResponse;
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

    const response = await handler(handlerReq, {});

    // 不要在这里设置 functions-request-id，避免重复
    // response.headers.set('functions-request-id', req.headers['x-scf-request-id'] || '');
    // const requestEndTime = Date.now();

    // 解析请求路径
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

    // console.log(`Request processing time: ${requestEndTime - requestStartTime}ms`);
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
  