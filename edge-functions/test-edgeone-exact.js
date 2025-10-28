/**
 * Test with exact EdgeOne Functions simulation
 */

import { createTokenSimple } from './lib/auth-simple.js';

// Create a valid token for testing
const validToken = await createTokenSimple({ 
  email: 'test@privanet.com', 
  sub: 'test@privanet.com' 
}, 'simplified-signature');

console.log('Generated valid token:', validToken);

// Test the exact function calls that would happen in EdgeOne Functions
async function testExactEdgeOneEnvironment() {
  console.log('\n=== Testing Exact EdgeOne Functions Environment ===');
  
  // Mock the exact EdgeOne Functions environment
  const mockEnv = {
    JWT_SECRET: 'simplified-signature'
  };
  
  // Mock KV that might be missing methods
  const mockKV = {
    get: async (key) => {
      console.log('KV get called for:', key);
      return null; // Simulate no data
    },
    put: async (key, value, options) => {
      console.log('KV put called for:', key);
      return true;
    }
    // Note: missing delete method - this could cause the error
  };
  
  // Add KV to env
  mockEnv.MY_KV = mockKV;
  
  console.log('\n1. Testing proxy auth function...');
  
  try {
    const proxyAuthModule = await import('./api/proxy/auth.js');
    
    // Create exact request object that EdgeOne Functions would create
    const request = new Request('https://your-domain.com/api/proxy/auth', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${validToken}`,
        'content-type': 'application/json'
      }
    });
    
    // Create exact context object that EdgeOne Functions would provide
    const context = {
      request,
      env: mockEnv,
      // Note: no 'user' property - this gets added by middleware
    };
    
    console.log('Calling proxy auth with exact EdgeOne Functions context...');
    
    // This should trigger the middleware first
    const result = await proxyAuthModule.onRequestGet(context);
    
    console.log('Proxy auth result status:', result.status);
    const responseText = await result.text();
    console.log('Proxy auth response:', responseText);
    
  } catch (error) {
    console.error('❌ Proxy auth failed:', error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('\n2. Testing subscription status function...');
  
  try {
    const subscriptionModule = await import('./api/subscription/status.js');
    
    // Create exact request object
    const request = new Request('https://your-domain.com/api/subscription/status', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${validToken}`,
        'content-type': 'application/json'
      }
    });
    
    const context = {
      request,
      env: mockEnv
    };
    
    console.log('Calling subscription status with exact EdgeOne Functions context...');
    
    const result = await subscriptionModule.onRequestGet(context);
    
    console.log('Subscription status result status:', result.status);
    const responseText = await result.text();
    console.log('Subscription status response:', responseText);
    
  } catch (error) {
    console.error('❌ Subscription status failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
await testExactEdgeOneEnvironment();