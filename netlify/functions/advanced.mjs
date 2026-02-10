// Netlify Function - Advanced Example with Query & POST support
export default async (req, context) => {
  const url = new URL(req.url);
  const name = url.searchParams.get('name') || 'Guest';
  
  // 处理 POST 请求
  let postData = null;
  if (req.method === 'POST') {
    try {
      postData = await req.json();
    } catch (e) {
      postData = await req.text();
    }
  }

  return new Response(JSON.stringify({
    message: `Hello, ${name}!`,
    method: req.method,
    queryParams: Object.fromEntries(url.searchParams),
    postData,
    headers: Object.fromEntries(req.headers),
    timestamp: new Date().toISOString(),
    // Netlify Context 信息
    geo: context.geo,
    ip: context.ip
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};

export const config = {
  path: "/api/advanced"
};
