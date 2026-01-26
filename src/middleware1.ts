import { ipAddress } from '@vercel/functions'
import { geolocation } from '@vercel/functions'

import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const ip = ipAddress(request);
  const { city } = geolocation(request)

  console.log('ip', ip);


  // return new Response('111' + request?.toString());
 
  // ...
}
