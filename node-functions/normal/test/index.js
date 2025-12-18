export default function onRequest(context) {
  console.log('header x-request-id', JSON.stringify(context.request.headers.get('x-request-id')));

  console.log('header x-custom-header2', JSON.stringify(context.request.headers.get('x-custom-header')));

  return new Response('Hello from Node Functions2!');
}