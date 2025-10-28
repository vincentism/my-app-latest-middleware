/**
 * Test to reproduce the exact 545 error
 */

// Test with the exact same token from the failing test
const problematicToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAcHJpdmFuZXQuY29tIiwic3ViIjoidGVzdEBwcml2YW5ldC5jb20iLCJpYXQiOjE3Mjk2MDgxNzMsImV4cCI6MTczMjIwMDE3M30.simplified-signature';

async function testProblematicToken() {
  console.log('Testing the problematic token from the failing test...');
  console.log('Token:', problematicToken);
  
  try {
    const { verifyTokenSimple } = await import('./lib/auth-simple.js');
    
    console.log('Verifying token...');
    const result = verifyTokenSimple(problematicToken, 'simplified-signature');
    console.log('Token verification result:', result);
    
    if (result.valid) {
      console.log('✓ Token is valid, user:', result.payload);
    } else {
      console.log('✗ Token verification failed:', result.message);
    }
    
  } catch (error) {
    console.error('Token verification error:', error.message);
  }
}

async function testWithNoKV() {
  console.log('\n=== Testing with completely missing KV ===');
  
  // Mock environment with NO KV at all (like EdgeOne Functions might have)
  const mockEnv = {
    JWT_SECRET: 'simplified-signature'
    // MY_KV is completely missing
  };
  
  console.log('Environment:', JSON.stringify(mockEnv, null, 2));
  
  try {
    const proxyAuthModule = await import('./api/proxy/auth.js');
    
    const request = new Request('https://your-domain.com/api/proxy/auth', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${problematicToken}`,
        'content-type': 'application/json'
      }
    });
    
    const context = {
      request,
      env: mockEnv
    };
    
    console.log('Calling proxy auth with NO KV...');
    
    const result = await proxyAuthModule.onRequestGet(context);
    
    console.log('Result status:', result.status);
    const responseText = await result.text();
    console.log('Response:', responseText);
    
  } catch (error) {
    console.error('❌ Error with no KV:', error.message);
    console.error('Stack:', error.stack);
  }
}

async function testWithUndefinedJWTSecret() {
  console.log('\n=== Testing with undefined JWT_SECRET ===');
  
  // Mock environment with undefined JWT_SECRET
  const mockEnv = {
    JWT_SECRET: undefined,
    MY_KV: {
      get: async () => null,
      put: async () => true,
      delete: async () => true
    }
  };
  
  console.log('Environment JWT_SECRET:', mockEnv.JWT_SECRET);
  
  try {
    const proxyAuthModule = await import('./api/proxy/auth.js');
    
    const request = new Request('https://your-domain.com/api/proxy/auth', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${problematicToken}`,
        'content-type': 'application/json'
      }
    });
    
    const context = {
      request,
      env: mockEnv
    };
    
    console.log('Calling proxy auth with undefined JWT_SECRET...');
    
    const result = await proxyAuthModule.onRequestGet(context);
    
    console.log('Result status:', result.status);
    const responseText = await result.text();
    console.log('Response:', responseText);
    
  } catch (error) {
    console.error('❌ Error with undefined JWT_SECRET:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run all tests
await testProblematicToken();
await testWithNoKV();
await testWithUndefinedJWTSecret();