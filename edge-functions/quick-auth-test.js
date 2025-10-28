const https = require('https');

console.log('Testing auth endpoints...');

function testAuth(path, method = 'GET') {
  const url = 'https://vpn-eo.oilpipe.xyz' + path;
  console.log(`Testing ${method} ${path}`);
  
  https.get(url, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type'] || 'none'}`);
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Response (first 100 chars): ${data.substring(0, 100)}`);
      console.log('---');
    });
  }).on('error', err => {
    console.log(`Error: ${err.message}`);
    console.log('---');
  });
}

// Test auth endpoints
testAuth('/api/auth/login');
testAuth('/api/auth/google/redirect');
testAuth('/api/auth/register');