/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Utility functions for graceful degradation when external services are unavailable

/**
 * Check if KV storage is available and working
 */
export async function checkKVAvailability(env) {
  if (!env.MY_KV) {
    return { available: false, reason: 'KV_NOT_CONFIGURED' };
  }
  
  try {
    // Try a simple KV operation with better error handling
    const testKey = 'health_check:test';
    const testValue = JSON.stringify({ timestamp: Date.now() });
    
    // Check if KV has the required methods
    if (typeof env.MY_KV.put !== 'function' || typeof env.MY_KV.get !== 'function') {
      return { available: false, reason: 'KV_METHODS_MISSING' };
    }
    
    await env.MY_KV.put(testKey, testValue, { expirationTtl: 60 }); // 1 minute TTL
    const retrieved = await env.MY_KV.get(testKey);
    
    // Try to delete only if the method exists
    if (typeof env.MY_KV.delete === 'function') {
      await env.MY_KV.delete(testKey);
    }
    
    return { available: true, testPassed: retrieved === testValue };
  } catch (error) {
    console.error('KV health check failed:', error);
    return { available: false, reason: 'KV_OPERATION_FAILED', error: error.message };
  }
}

/**
 * Get user subscription with fallback logic
 */
export async function getUserSubscriptionWithFallback(env, userId) {
  // First try to check if KV is available
  const kvCheck = await checkKVAvailability(env);
  
  if (!kvCheck.available) {
    console.log(`KV unavailable (${kvCheck.reason}), using fallback for user:`, userId);
    return getMockSubscription(userId);
  }
  
  try {
    // Try to get real subscription data
    const subscriptionData = await env.MY_KV.get(`subscription:${userId}`);
    
    if (!subscriptionData) {
      return { status: 'none', has_subscription: false };
    }
    
    return JSON.parse(subscriptionData);
  } catch (error) {
    console.error('Failed to get subscription from KV:', error);
    return getMockSubscription(userId);
  }
}

/**
 * Mock subscription data for testing and fallback scenarios
 */
export function getMockSubscription(userId) {
  const isTestUser = userId === 'test@privanet.com' || userId?.includes('test');
  const isAdmin = userId === 'admin' || userId?.includes('admin');
  
  if (isTestUser || isAdmin) {
    const now = Date.now();
    return {
      status: 'active',
      has_subscription: true,
      plan: 'Premium',
      stripe_customer_id: 'cus_mock_test',
      stripe_subscription_id: 'sub_mock_test',
      current_period_start: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(now + 335 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      is_expired: false,
      mock_data: true,
      reason: 'kv_fallback'
    };
  }
  
  return {
    status: 'inactive',
    has_subscription: false,
    mock_data: true,
    reason: 'kv_fallback'
  };
}

/**
 * Store user data with fallback handling
 */
export async function storeUserDataWithFallback(env, key, data) {
  const kvCheck = await checkKVAvailability(env);
  
  if (!kvCheck.available) {
    console.log(`Cannot store user data: KV unavailable (${kvCheck.reason})`);
    return { success: false, reason: kvCheck.reason };
  }
  
  try {
    await env.MY_KV.put(key, JSON.stringify(data));
    return { success: true };
  } catch (error) {
    console.error('Failed to store user data:', error);
    return { success: false, reason: 'KV_STORE_FAILED', error: error.message };
  }
}

/**
 * Get user data with fallback handling
 */
export async function getUserDataWithFallback(env, key) {
  const kvCheck = await checkKVAvailability(env);
  
  if (!kvCheck.available) {
    console.log(`Cannot get user data: KV unavailable (${kvCheck.reason})`);
    return null;
  }
  
  try {
    const data = await env.MY_KV.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
}