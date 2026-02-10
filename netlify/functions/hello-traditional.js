// Netlify Function - Traditional Format
exports.handler = async (event, context) => {
  // 支持 GET/POST
  const method = event.httpMethod;
  const path = event.path;
  const queryParams = event.queryStringParameters || {};
  const body = event.body ? JSON.parse(event.body) : null;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Hello from Node.js (Traditional Format)!',
      method,
      path,
      queryParams,
      receivedBody: body,
      timestamp: new Date().toISOString()
    })
  };
};
