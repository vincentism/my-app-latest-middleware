import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // return NextResponse.redirect(new URL('/homexxx', request.url))

  // return new Response('Hello, world in webpack')

  const res =  NextResponse.next();
  // res.headers.append('x-custom-header-vi', 'hello');
  res.cookies.set('vercel', 'fast')
  res.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  return res;




  // // Given an incoming request...
  // const newHeaders = new Headers(request.headers)
  // // Add a new header
  // newHeaders.set('x-version', '123')
  // // Forward the modified request headers upstream
  // return NextResponse.next({
  //   request: {
  //     // New request headers
  //     headers: newHeaders,
  //   },
  // })
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
    matcher: [
      // Exclude API routes, static files, image optimizations, and .png files
      // '/((?!api|_next/static|_next/image|.*\\.png$).*)',
      '/normal/test'
    ],
}




