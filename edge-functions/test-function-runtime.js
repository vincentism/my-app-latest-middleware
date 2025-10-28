/**
 * Test the actual function execution with mock context
 */

// Mock environment variables
const mockEnv = {
  JWT_SECRET: 'simplified-signature',
  MY_KV: {
    get: async (key) => {
      console.log('KV get called for key:', key);
      if (key.includes('test@privanet.com')) {
        return JSON.stringify({ email: 'test@privanet.com', name: 'Test User' });
      }
      if (key.includes('subscription:test@privanet.com')) {
        return JSON.stringify({ status: 'active', has_subscription: true });
      }
      return null;
    },
    put: async (key, value) => {
      console.log('KV put called for key:', key);
      return true;
    }
  }
};

// Mock user
const mockUser = {
  email: 'test@privanet.com',
  sub: 'test@privanet.com'
};

// Mock request
const mockRequest = {
  headers: new Map([
    ['authorization', 'Bearer valid-token']
  ])
};

async function testProxyAuth() {
  console.log('Testing proxy auth function...');
  
  try {
    const proxyAuthModule = await import('./api/proxy/auth.js');
    
    // Create mock context
    const context = {
      request: mockRequest,
      env: mockEnv,
      user: mockUser
    };
    
    console.log('Calling issueProxyToken with context:', JSON.stringify(context, null, 2));
    
    // Call the function directly
    const result = await proxyAuthModule.onRequestGet(context);
    
    console.log('Proxy auth result:', {
      status: result.status,
      headers: Object.fromEntries(result.headers),
      body: await result.text()
    });
    
  } catch (error) {
    console.error('Proxy auth error:', error.message);
    console.error('Stack:', error.stack);
  }
}

async function testSubscriptionStatus() {
  console.log('\nTesting subscription status function...');
  
  try {
    const subscriptionModule = await import('./api/subscription/status.js');
    
    // Create mock context
    const context = {
      request: mockRequest,
      env: mockEnv,
      user: mockUser
    };
    
    console.log('Calling getSubscriptionStatus with context:', JSON.stringify(context, null, 2));
    
    // Call the function directly
    const result = await subscriptionModule.onRequestGet(context);
    
    console.log('Subscription status result:', {
      status: result.status,
      headers: Object.fromEntries(result.headers),
      body: await result.text()
    });
    
  } catch (error) {
    console.error('Subscription status error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests
await testProxyAuth();
await testSubscriptionStatus();