import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Test deployed EdgeOne Functions
async function testDeployedEdgeOneFunctions() {
  console.log('🌐 Testing Deployed EdgeOne Functions...\n');
  
  const baseUrl = 'https://vpn-eo.oilpipe.xyz';
  
  // Test the functions we converted
  const tests = [
    {
      name: 'Subscription Status',
      url: `${baseUrl}/api/subscription/status`,
      method: 'GET',
      headers: {}
    },
    {
      name: 'Proxy Nodes',
      url: `${baseUrl}/api/proxy/nodes`,
      method: 'GET',
      headers: {}
    },
    {
      name: 'Proxy Auth',
      url: `${baseUrl}/api/proxy/auth`,
      method: 'GET',
      headers: {}
    },
    {
      name: 'Payment Create Checkout',
      url: `${baseUrl}/api/payment/create-checkout`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'monthly' })
    },
    {
      name: 'Payment Webhook',
      url: `${baseUrl}/api/payment/webhook`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'checkout.session.completed' })
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`🧪 Testing: ${test.name}`);
    console.log(`🌐 URL: ${test.url}`);
    console.log(`📤 Method: ${test.method}`);
    
    try {
      const options = {
        method: test.method,
        headers: test.headers
      };
      
      if (test.body) {
        options.body = test.body;
      }
      
      const response = await fetch(test.url, options);
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log(`📄 Content-Type: ${contentType || 'unknown'}`);
      
      let responseData;
      if (isJson) {
        responseData = await response.json();
        console.log(`📄 Response:`, responseData);
        
        // Check if it's a proper API response
        if (responseData.message || responseData.user || responseData.nodes || responseData.sessionId) {
          console.log('✅ Function appears to be working (API response)');
          passed++;
        } else {
          console.log('⚠️  Unexpected response format');
          failed++;
        }
      } else {
        responseData = await response.text();
        const preview = responseData.substring(0, 200);
        console.log(`📄 Response preview: ${preview}`);
        
        // Check if it's HTML (fallback to static site)
        if (responseData.includes('<!DOCTYPE html>') || responseData.includes('<html')) {
          console.log('❌ Function not found (HTML fallback)');
          failed++;
        } else if (response.status === 405) {
          console.log('❌ Method not allowed (function may not exist)');
          failed++;
        } else {
          console.log('⚠️  Unexpected response type');
          failed++;
        }
      }
      
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
      failed++;
    }
    
    console.log('━'.repeat(60));
  }
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All EdgeOne Functions are working correctly!');
  } else {
    console.log('\n⚠️  Some functions may not be deployed or configured correctly.');
    console.log('💡 Suggestions:');
    console.log('   - Check edgeone.json configuration');
    console.log('   - Verify functions are deployed to EdgeOne');
    console.log('   - Check function paths and routing');
  }
}

// Run the test
testDeployedEdgeOneFunctions().catch(console.error);