/**
 * Test script to check if EdgeOne Functions are actually deployed
 */

const testFunctionsDeployment = async () => {
  const endpoints = [
    'https://vpn-eo.oilpipe.xyz/api/simple-test',
    'https://vpn-eo.oilpipe.xyz/api/test-context',
    'https://vpn-eo.oilpipe.xyz/api/test-middleware-import',
    'https://vpn-eo.oilpipe.xyz/api/system/status',
    'https://vpn-eo.oilpipe.xyz/api/env'
  ];

  console.log('🔍 Testing EdgeOne Functions Deployment Status\n');

  for (const url of endpoints) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'EdgeOne-Function-Test'
        }
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
      
      const content = await response.text();
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const isHtml = content.includes('<!DOCTYPE html>') || content.includes('<html');
      
      if (isJson) {
        console.log('✅ Function is working (JSON response)');
        try {
          const data = JSON.parse(content);
          console.log(`Response: ${JSON.stringify(data, null, 2).substring(0, 100)}...`);
        } catch (e) {
          console.log('❌ Invalid JSON response');
        }
      } else if (isHtml) {
        console.log('❌ Function not found (HTML fallback)');
        console.log(`First 100 chars: ${content.substring(0, 100)}...`);
      } else {
        console.log('⚠️  Unknown response type');
        console.log(`Content: ${content.substring(0, 100)}...`);
      }
      
      console.log('---\n');
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
};

testFunctionsDeployment();