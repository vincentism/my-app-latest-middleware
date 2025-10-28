export function onRequestGet(context) {
  const servers = [
    { id: 'jp-tokyo', location: 'Tokyo, Japan', flag: '🇯🇵', domain: 'jp.proxy.privanet.com' },
    { id: 'us-nyc', location: 'New York, USA', flag: '🇺🇸', domain: 'us.proxy.privanet.com' },
    { id: 'uk-london', location: 'London, UK', flag: '🇬🇧', domain: 'uk.proxy.privanet.com' },
    { id: 'de-frankfurt', location: 'Frankfurt, DE', flag: '🇩🇪', domain: 'de.proxy.privanet.com' },
  ];
  
  return new Response(JSON.stringify({ 
    status: "ok", 
    nodes: servers,
    timestamp: new Date().toISOString(),
    auth: "not-required"
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}