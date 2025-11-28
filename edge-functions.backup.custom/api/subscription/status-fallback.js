/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { jsonResponse, errorResponse } from '../../lib/utils.js';
import { requireAuth } from '../../lib/middleware.js';

// Fallback subscription status function for when KV storage is not available
async function getSubscriptionStatusFallback(context) {
  try {
    const { env, user } = context;
    const { MY_KV } = env;
    
    // If KV storage is not configured, provide mock data for testing
    if (!MY_KV) {
      console.log('KV storage not available, returning mock subscription data');
      
      // Check if user is test user or admin
      const userId = user.sub || user.email || user.walletAddress;
      const isTestUser = userId === 'test@privanet.com' || user.isAdmin;
      
      return jsonResponse({
        has_subscription: isTestUser,
        status: isTestUser ? 'active' : 'inactive',
        message: isTestUser ? 'Active subscription (mock data)' : 'No active subscription found',
        mock_data: true,
        user_id: userId,
        stripe_customer_id: isTestUser ? 'cus_mock_test_user' : null,
        stripe_subscription_id: isTestUser ? 'sub_mock_test_subscription' : null,
        current_period_start: isTestUser ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        current_period_end: isTestUser ? new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString() : null,
        is_expired: false,
      });
    }
    
    // If KV is available, use the normal logic but with better error handling
    const userId = user.sub;
    
    try {
      const subscriptionData = await MY_KV.get(`subscription:${userId}`);
      
      if (!subscriptionData) {
        return jsonResponse({
          has_subscription: false,
          status: 'none',
          message: 'No active subscription found'
        });
      }
      
      const subscription = JSON.parse(subscriptionData);
      
      // Check if subscription is active and not expired
      const isActive = subscription.status === 'active';
      const currentTime = new Date();
      const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
      const isExpired = periodEnd && currentTime > periodEnd;
      
      return jsonResponse({
        has_subscription: isActive && !isExpired,
        status: subscription.status,
        stripe_customer_id: subscription.stripe_customer_id,
        stripe_subscription_id: subscription.stripe_subscription_id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        created_at: subscription.created_at,
        updated_at: subscription.updated_at,
        is_expired: isExpired,
      });
      
    } catch (kvError) {
      console.error('KV operation failed:', kvError);
      // If KV operation fails, return mock data
      return jsonResponse({
        has_subscription: false,
        status: 'error',
        message: 'Database temporarily unavailable',
        mock_data: true,
        error: 'kv_operation_failed'
      });
    }
    
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    
    // Provide more specific error messages
    if (error.message && error.message.includes('KV')) {
      return errorResponse("Database connection error. Please try again later.", 500);
    } else if (error.message && error.message.includes('not found')) {
      return errorResponse("Subscription not found", 404);
    } else {
      return errorResponse("Failed to fetch subscription status. Please try again.", 500);
    }
  }
}

export const onRequestGet = requireAuth(getSubscriptionStatusFallback);