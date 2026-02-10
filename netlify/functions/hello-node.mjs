// Netlify Function - Node.js
export default async (req, context) => {
  return new Response(JSON.stringify({
    message: "Hello from Node.js Function!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const config = {
  path: "/api/hello-node"
};
