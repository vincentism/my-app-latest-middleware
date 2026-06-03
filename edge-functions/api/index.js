// File path ./edge-functions/api/index.js
// Access path example.com/api
export async function onRequest(context) {
  const url = new URL(context.request.url);


  console.log('url.origin', url.origin);
  // 同源请求：测试 Fetch By CDN 劫持是否生效
  const sameOriginRes = await fetch(`${url.origin}/test-path`, {
    headers: { host: context.request.headers.get('host') },
  });
  console.log('same-origin status:', sameOriginRes.status);

  // 外部请求：对比
  const externalRes = await fetch('https://httpbin.org/get');
  console.log('external status:', externalRes.status);

  return new Response(JSON.stringify({
    sameOrigin: sameOriginRes.status,
    external: externalRes.status,
  }), {
    headers: { 'content-type': 'application/json' },
  });
}