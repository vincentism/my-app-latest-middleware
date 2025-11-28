export function onRequestGet(context) {
  return new Response(JSON.stringify({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "privanet-health" 
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
