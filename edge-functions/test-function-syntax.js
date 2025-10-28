/**
 * Test script to check for syntax errors in the functions
 */

// Test importing the functions directly
console.log('Testing function imports...');

try {
  console.log('Testing proxy auth function...');
  const proxyAuthModule = await import('./api/proxy/auth.js');
  console.log('✓ Proxy auth module imported successfully');
  console.log('Available exports:', Object.keys(proxyAuthModule));
} catch (error) {
  console.error('✗ Proxy auth import error:', error.message);
  console.error('Stack:', error.stack);
}

try {
  console.log('Testing subscription status function...');
  const subscriptionModule = await import('./api/subscription/status.js');
  console.log('✓ Subscription status module imported successfully');
  console.log('Available exports:', Object.keys(subscriptionModule));
} catch (error) {
  console.error('✗ Subscription status import error:', error.message);
  console.error('Stack:', error.stack);
}

try {
  console.log('Testing middleware function...');
  const middlewareModule = await import('./lib/middleware.js');
  console.log('✓ Middleware module imported successfully');
  console.log('Available exports:', Object.keys(middlewareModule));
} catch (error) {
  console.error('✗ Middleware import error:', error.message);
  console.error('Stack:', error.stack);
}

try {
  console.log('Testing fallback function...');
  const fallbackModule = await import('./lib/fallback.js');
  console.log('✓ Fallback module imported successfully');
  console.log('Available exports:', Object.keys(fallbackModule));
} catch (error) {
  console.error('✗ Fallback import error:', error.message);
  console.error('Stack:', error.stack);
}

try {
  console.log('Testing auth-simple function...');
  const authSimpleModule = await import('./lib/auth-simple.js');
  console.log('✓ Auth-simple module imported successfully');
  console.log('Available exports:', Object.keys(authSimpleModule));
} catch (error) {
  console.error('✗ Auth-simple import error:', error.message);
  console.error('Stack:', error.stack);
}

console.log('Import tests completed.');