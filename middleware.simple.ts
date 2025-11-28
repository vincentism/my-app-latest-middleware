
// import fs from 'fs';  // ❌ Edge Runtime 不支持

// import buffer from 'buffer';
// import NextRespone 


export function middleware(request) {
  // const data = fs.readFileSync('file.txt');  // ❌ 会报错
  // console.log('data:', data);

  const { redirect, rewrite, geo, clientIp, env, waitUntil } = request;

  console.log('request in middleware', request.url);

  // 返回 502 Bad Gateway 错误响应
  return new Response(
    JSON.stringify({ 
      error: 'Bad Gateway',
      message: '测试 502 错误响应',
      timestamp: new Date().toISOString()
    }), 
    { 
      status: 502,
      statusText: 'Bad Gateway',
      headers: {
        'Content-Type': 'application/json',
        'X-Error-Source': 'middleware'
      }
    }
  );

  // return new Response("Blog single match:");
  // console.log('in middleware - buffer:', buffer);  
  // 添加自定义响应头
  // response.headers.set('x-middleware-executed-with-root', buffer.Buffer.from('hello').toString('base64'));
  
}

export const config = {
  // runtime: 'node',
  matcher: [
    '/api',

  ],
}


