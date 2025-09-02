
import { MiddlewareRequest, type NextRequest } from '@netlify/next';


export async function middleware(nextRequest: NextRequest) {

  console.log('in middleware');
  const request = new MiddlewareRequest(nextRequest);



  const response = await request.next();
  // const message = `This was static but has been transformed in ${request.geo.city}`;

  // response.setPageProp("message", message);

  // 通过响应头传递地理信息，而不是 setPageProp
  if (request.geo?.city) {
    response.headers.set('x-geo-city', request.geo.city);
  } else {
    response.headers.set('x-geo-city', 'no-city');
  }


  return response;
  // ...
}
