/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { jsonResponse, errorResponse, handleOptions } from "../../lib/utils.js";
import { createTokenSimple } from "../../lib/auth-simple.js";
import { requireAuthWithFallback } from "../../lib/middleware.js";
import { getUserSubscriptionWithFallback, getUserDataWithFallback, checkKVAvailability } from "../../lib/fallback.js";

// This function issues a short-lived token for the data plane (the proxy).
async function issueProxyToken(context) {
    const { request, env, user } = context;
    try {
        const { MY_KV, JWT_SECRET } = env;

        if (!JWT_SECRET) {
            return errorResponse("JWT secret is not configured", 500);
        }

        // Check KV availability with error handling
        let kvCheck;
        try {
            kvCheck = await checkKVAvailability(env);
        } catch (kvError) {
            console.warn('KV availability check failed:', kvError.message);
            kvCheck = { available: false, reason: 'KV_CHECK_FAILED' };
        }
        
        if (!kvCheck.available) {
            console.warn(`KV storage unavailable (${kvCheck.reason}), using fallback for proxy auth`);
        }

        let userKey;
        let userIdentifier;
        if (user.email) {
            userKey = `user:${user.email}`;
            userIdentifier = user.email;
        } else if (user.walletAddress) {
            userKey = `user:wallet:${user.walletAddress}`;
            userIdentifier = user.walletAddress;
        } else {
            return errorResponse("Invalid authentication token payload.", 400);
        }

        // Get user data with fallback handling
        const userInfo = await getUserDataWithFallback(env, userKey);
        if (!userInfo && !kvCheck.available) {
            // If KV is unavailable and we can't get user data, allow test users only
            const isTestUser = userIdentifier === 'test@privanet.com' || userIdentifier === 'admin' || userIdentifier?.includes('test');
            if (!isTestUser) {
                return errorResponse("User data unavailable and not a test user", 503);
            }
        } else if (!userInfo) {
            return errorResponse("User not found", 404);
        }

        // Check subscription status with fallback handling
        const subscription = await getUserSubscriptionWithFallback(env, userIdentifier);
        
        if (!subscription.has_subscription) {
            return errorResponse("Active subscription required for proxy access", 403);
        }

        // Create a special, short-lived token for the proxy
        const now = Math.floor(Date.now() / 1000);
        const proxyTokenPayload = { 
            id: userIdentifier, 
            proxy: true, // Specific claim to identify this as a proxy token
            iat: now,
            exp: now + (5 * 60) // Expires in 5 minutes
        };
        const proxyToken = await createTokenSimple(proxyTokenPayload, JWT_SECRET);
        
        return jsonResponse({ 
            token: proxyToken,
            expires_in: 300, // 5 minutes
            token_type: 'Bearer',
            subscription_status: subscription.status,
            kv_available: kvCheck.available
        });

    } catch (e) {
        console.error("Proxy Auth Error:", e);
        return errorResponse("An internal server error occurred.", 500);
    }
}

export async function onRequestGet(context) {
    try {
        const { request, env } = context;

        // Use the simplified auth middleware with fallback
        // The middleware will directly call the handler if auth succeeds
        return await requireAuthWithFallback(async (ctx) => {
            const user = ctx.user;
            
            // Issue proxy token
            return await issueProxyToken({ request, env, user });
        })(context);
    } catch (error) {
        console.error('Proxy auth endpoint error:', error);
        return errorResponse('Internal server error', 500);
    }
}

export async function onRequestOptions({ request }) {
    return handleOptions(request);
}
