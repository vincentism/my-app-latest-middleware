/**
 * Test other API files to check deployment status
 */

const testEndpoints = [
  {
    name: 'bare-test.js',
    url: 'https://vpn-eo.oilpipe.xyz/api/bare-test',
    expected: 'bare-test function'
  },
  {
    name: 'simple-test.js', 
    url: 'https://vpn-eo.oilpipe.xyz/api/simple-test',
    expected: 'simple-test function'
  },
  {
    name: 'ultra-simple.js',
    url: 'https://vpn-eo.oilpipe.xyz/api/ultra-simple', 
    expected: 'ultra-simple function'
  },
  {
    name: 'env-test.js',
    url: 'https://vpn-eo.oilpipe.xyz/api/env-test',
    expected: 'env test'
  },
  {
    name: 'kv-test.js',
    url: 'https://vpn-eo.oilpipe.xyz/api/kv-test',
    expected: 'kv test'
  },
  {
    name: 'public-nodes.js',
    url: 'https://vpn-eo.oilpipe.xyz/api/public-nodes',
    expected: 'public nodes'
  }
];

const testEndpoint = async (endpoint) => {
  console.log(`\n🧪 Testing: ${endpoint.name}`);
  console.log(`📍 URL: ${endpoint.url}`);
  
  try {
    const response = await fetch(endpoint.url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'File-Test-Script'
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
    
    const content = await response.text();
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const isHtml = content.includes('<!DOCTYPE html>') || content.includes('<html');
    
    if (isJson) {
      console.log('✅ Working (JSON response)');
      try {
        const data = JSON.parse(content);
        console.log(`📄 Response: ${JSON.stringify(data, null, 2).substring(0, 150)}...`);
      } catch (e) {
        console.log('❌ Invalid JSON:', e.message);
      }
    } else if (isHtml) {
      console.log('❌ Not working (HTML fallback)');
      console.log(`📄 First 100 chars: ${content.substring(0, 100)}...`);
    } else {
      console.log('⚠️  Unknown response type');
      console.log(`📄 Content: ${content.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
};

const checkLocalFiles = () => {
  console.log('\n📁 Checking Local API Files:');
  const fs = require('fs');
  const path = require('path');
  
  const apiDir = 'api';
  if (fs.existsSync(apiDir)) {
    const files = fs.readdirSync(apiDir).filter(file => file.endsWith('.js'));
    console.log('Local API files:');
    files.forEach(file => {
      const filePath = path.join(apiDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  📄 ${file} (${stats.size} bytes)`);
    });
  }
  
  const distApiDir = 'dist/functions/api';
  if (fs.existsSync(distApiDir)) {
    const files = fs.readdirSync(distApiDir).filter(file => file.endsWith('.js'));
    console.log('\nDist API files:');
    files.forEach(file => {
      const filePath = path.join(distApiDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  📄 ${file} (${stats.size} bytes)`);
    });
  } else {
    console.log('❌ Dist API directory not found');
  }
};

// Run tests
(async () => {
  console.log('🔍 Testing Other API Files\n');
  console.log('='.repeat(50));
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
    console.log('-'.repeat(50));
  }
  
  checkLocalFiles();
})();