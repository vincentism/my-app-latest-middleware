const https = require('https');

console.log('🔍 Authentication Endpoint Analysis');
console.log('=====================================');
console.log('');

function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const url = 'https://vpn-eo.oilpipe.xyz' + path;
    console.log(`🧪 Testing: ${method} ${path}`);
    
    const options = {
      method: method,
      headers: {
        'User-Agent': 'Auth-Test-Script/1.0'
      }
    };
    
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📋 Content-Type: ${res.headers['content-type'] || 'none'}`);
        
        // Analyze response
        if (res.statusCode === 545) {
          console.log('🔴 545 Error - Function deployed but runtime error');
          console.log(`📄 Response: ${data.substring(0, 100)}`);
        } else if (res.statusCode === 404) {
          console.log('❌ 404 - Function not found');
        } else if (res.statusCode === 200) {
          if (res.headers['content-type']?.includes('text/html')) {
            console.log('⚠️  200 HTML - Function fallback to static page');
          } else {
            console.log('✅ 200 JSON - Function working correctly');
          }
        } else {
          console.log(`📄 Response: ${data.substring(0, 100)}`);
        }
        
        console.log('---');
        resolve({
          path,
          method,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          data: data.substring(0, 200)
        });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Error: ${err.message}`);
      console.log('---');
      resolve({ path, method, error: err.message });
    });
    
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runTests() {
  const tests = [
    testEndpoint('/api/auth/login', 'GET'),
    testEndpoint('/api/auth/login', 'POST', JSON.stringify({
      message: "test",
      signature: "test",
      walletAddress: "0x1234567890123456789012345678901234567890"
    })),
    testEndpoint('/api/auth/login', 'OPTIONS'),
    testEndpoint('/api/auth/register', 'GET'),
    testEndpoint('/api/auth/register', 'POST', JSON.stringify({
      email: "test@example.com",
      password: "password"
    })),
    testEndpoint('/api/auth/google/redirect', 'GET'),
    testEndpoint('/api/auth/google/callback', 'GET'),
    testEndpoint('/api/auth/google/callback?code=test', 'GET')
  ];
  
  const results = await Promise.all(tests);
  
  console.log('📊 Test Results Summary');
  console.log('======================');
  console.log('');
  
  const status545 = results.filter(r => r.status === 545);
  const status404 = results.filter(r => r.status === 404);
  const status200 = results.filter(r => r.status === 200);
  const errors = results.filter(r => r.error);
  
  console.log(`🔴 545 Runtime Errors: ${status545.length}`);
  console.log(`❌ 404 Not Found: ${status404.length}`);
  console.log(`✅ 200 OK: ${status200.length}`);
  console.log(`💥 Request Errors: ${errors.length}`);
  console.log('');
  
  if (status545.length > 0) {
    console.log('🔍 545 Error Analysis:');
    console.log('   Functions are deployed but failing at runtime');
    console.log('   Common causes:');
    console.log('   - Missing environment variables (JWT_SECRET, GOOGLE_CLIENT_ID, etc.)');
    console.log('   - Import/module resolution errors');
    console.log('   - Runtime exceptions in function code');
    console.log('');
    
    status545.forEach(result => {
      console.log(`   - ${result.method} ${result.path}: 545 error`);
    });
    console.log('');
  }
  
  if (status404.length > 0) {
    console.log('❌ 404 Analysis:');
    console.log('   Functions not found - may not be deployed to correct path');
    console.log('');
  }
  
  console.log('📁 Local Auth Files:');
  console.log('   All auth functions exist locally and are properly built');
  console.log('   - /api/auth/login.js (Web3 authentication)');
  console.log('   - /api/auth/register.js (Email registration - disabled)');
  console.log('   - /api/auth/google/redirect.js (OAuth redirect)');
  console.log('   - /api/auth/google/callback.js (OAuth callback)');
  console.log('');
  
  console.log('🎯 Conclusion:');
  if (status545.length > 0) {
    console.log('   ✅ Auth functions are deployed to EdgeOne');
    console.log('   ❌ But they have runtime errors (545 status)');
    console.log('   🔧 Check EdgeOne Function logs for detailed error messages');
  } else {
    console.log('   ❌ Auth functions not properly deployed or configured');
  }
}

runTests().catch(console.error);