import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Test our converted Edge Functions
async function testConvertedFunctions() {
  console.log('🧪 Testing Converted Edge Functions...\n');
  
  try {
    // Test 1: Import and check structure of converted functions
    console.log('📋 Test 1: Checking function structure...');
    
    // Test subscription status
    try {
      const subscriptionModule = await import('./api/subscription/status.js');
      console.log('✅ Subscription status module imported successfully');
      console.log('📦 Exports:', Object.keys(subscriptionModule));
      
      if (subscriptionModule.default && typeof subscriptionModule.default.fetch === 'function') {
        console.log('✅ Has default fetch function');
      } else {
        console.log('❌ Missing default fetch function');
      }
    } catch (error) {
      console.log('❌ Subscription status import failed:', error.message);
    }
    
    // Test proxy nodes
    try {
      const proxyNodesModule = await import('./api/proxy/nodes.js');
      console.log('✅ Proxy nodes module imported successfully');
      console.log('📦 Exports:', Object.keys(proxyNodesModule));
      
      if (proxyNodesModule.default && typeof proxyNodesModule.default.fetch === 'function') {
        console.log('✅ Has default fetch function');
      } else {
        console.log('❌ Missing default fetch function');
      }
    } catch (error) {
      console.log('❌ Proxy nodes import failed:', error.message);
    }
    
    // Test proxy auth
    try {
      const proxyAuthModule = await import('./api/proxy/auth.js');
      console.log('✅ Proxy auth module imported successfully');
      console.log('📦 Exports:', Object.keys(proxyAuthModule));
      
      if (proxyAuthModule.default && typeof proxyAuthModule.default.fetch === 'function') {
        console.log('✅ Has default fetch function');
      } else {
        console.log('❌ Missing default fetch function');
      }
    } catch (error) {
      console.log('❌ Proxy auth import failed:', error.message);
    }
    
    // Test payment create-checkout
    try {
      const paymentModule = await import('./api/payment/create-checkout.js');
      console.log('✅ Payment create-checkout module imported successfully');
      console.log('📦 Exports:', Object.keys(paymentModule));
      
      if (paymentModule.default && typeof paymentModule.default.fetch === 'function') {
        console.log('✅ Has default fetch function');
      } else {
        console.log('❌ Missing default fetch function');
      }
    } catch (error) {
      console.log('❌ Payment create-checkout import failed:', error.message);
    }
    
    // Test payment webhook
    try {
      const webhookModule = await import('./api/payment/webhook.js');
      console.log('✅ Payment webhook module imported successfully');
      console.log('📦 Exports:', Object.keys(webhookModule));
      
      if (webhookModule.default && typeof webhookModule.default.fetch === 'function') {
        console.log('✅ Has default fetch function');
      } else {
        console.log('❌ Missing default fetch function');
      }
    } catch (error) {
      console.log('❌ Payment webhook import failed:', error.message);
    }
    
    console.log('\n📋 Test 2: Testing Edge Function simulation...');
    
    // Create mock Edge Function environment
    const mockEnv = {
      JWT_SECRET: 'test-secret',
      STRIPE_SECRET_KEY: 'sk_test_123',
      STRIPE_PRICE_ID: 'price_test_123',
      MY_KV: new Map()
    };
    
    // Test subscription status function
    try {
      const subscriptionModule = await import('./api/subscription/status.js');
      const mockRequest = new Request('https://example.com/api/subscription/status', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5fQ.test'
        }
      });
      
      const response = await subscriptionModule.default.fetch(mockRequest, mockEnv);
      console.log('✅ Subscription status function executed');
      console.log('📊 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseData = await response.text();
      console.log('📄 Response data preview:', responseData.substring(0, 100));
      
    } catch (error) {
      console.log('❌ Subscription status function test failed:', error.message);
    }
    
    // Test proxy nodes function
    try {
      const proxyNodesModule = await import('./api/proxy/nodes.js');
      const mockRequest = new Request('https://example.com/api/proxy/nodes', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5fQ.test'
        }
      });
      
      const response = await proxyNodesModule.default.fetch(mockRequest, mockEnv);
      console.log('✅ Proxy nodes function executed');
      console.log('📊 Response status:', response.status);
      
      const responseData = await response.text();
      console.log('📄 Response data preview:', responseData.substring(0, 100));
      
    } catch (error) {
      console.log('❌ Proxy nodes function test failed:', error.message);
    }
    
    console.log('\n🎉 Edge Function conversion test completed!');
    
  } catch (error) {
    console.error('💥 Test suite failed:', error);
  }
}

// Run the test
testConvertedFunctions();