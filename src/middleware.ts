
// import { MiddlewareRequest, type NextRequest } from '@netlify/next';


// export async function middleware(nextRequest: NextRequest) {

//   console.log('in middleware');
//   const request = new MiddlewareRequest(nextRequest);



//   const response = await request.next();
//   // const message = `This was static but has been transformed in ${request.geo.city}`;

//   // response.setPageProp("message", message);

//   // 通过响应头传递地理信息，而不是 setPageProp
//   if (request.geo?.city) {
//     response.headers.set('x-geo-city', request.geo.city);
//   } else {
//     response.headers.set('x-geo-city', 'no-city');
//   }


//   return response;
//   // ...
// }

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('in middleware - pathname:', request.nextUrl.pathname);
  
  // 创建响应
  const response = NextResponse.next();
  
  // 添加自定义响应头
  response.headers.set('x-middleware-executed', 'true');
  response.headers.set('x-request-time', new Date().toISOString());
  
  return response;
}

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }
