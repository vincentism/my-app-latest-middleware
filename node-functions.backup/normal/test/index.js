export default function onRequest(context) {
  console.log('header x-version', JSON.stringify(context.request.headers.get('x-version')));

  console.log('header x-custom-header2', JSON.stringify(context.request.headers.get('x-custom-header')));

  return new Response('Hello from Node Functions2!');
}