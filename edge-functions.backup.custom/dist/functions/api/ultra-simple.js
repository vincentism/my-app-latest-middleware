export function onRequestGet(context) {
  return new Response(JSON.stringify({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "Ultra simple test - no imports"
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}