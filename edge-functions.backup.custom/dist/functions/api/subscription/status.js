/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { errorResponse, jsonResponse } from '../../lib/utils.js';
import { requireAuthWithFallback } from '../../lib/middleware.js';
import { getUserSubscriptionWithFallback, checkKVAvailability } from '../../lib/fallback.js';

async function getSubscriptionStatus(context) {
  try {
    const { env, user } = context;
    const userId = user.sub;
    
    // Use the fallback-aware function to get subscription data
    const subscription = await getUserSubscriptionWithFallback(env, userId);
    
    return jsonResponse(subscription);
    
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

export async function onRequestGet(context) {
    try {
        const { request, env } = context;

        // Use the simplified auth middleware with fallback
        // The middleware will directly call the handler if auth succeeds
        return await requireAuthWithFallback(async (ctx) => {
            const user = ctx.user;
            
            // Get subscription status
            return await getSubscriptionStatus({ request, env, user });
        })(context);
    } catch (error) {
        console.error('Subscription status endpoint error:', error);
        return errorResponse('Internal server error', 500);
    }
}