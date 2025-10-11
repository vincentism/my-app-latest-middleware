import { PagesResponse } from '@edgeone/middleware';

const res = new PagesResponse();
res.next();

export default function onRequest(context) {




  // redirect
  const { url} = context.request


  if (url === '/xxx') {

    Response.redirect('/xxx');
  }

}



// cookie header
// rewrite
// redirect
// next
// response

