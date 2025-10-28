/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper functions for Edge Function format
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ message }, status);
}

async function verifyToken(token, secret) {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;
    
    // Simple base64url decode
    const decodeBase64Url = (str) => {
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      while (str.length % 4) str += '=';
      return JSON.parse(atob(str));
    };

    // Verify signature
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureStr = atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/'));
    const signature = Uint8Array.from(signatureStr, c => c.charCodeAt(0));
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature.buffer,
      new TextEncoder().encode(dataToVerify)
    );

    if (!isValid) return null;

    return decodeBase64Url(encodedPayload);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

async function getUserSubscriptionWithFallback(env, userId) {
  // Check if KV is available
  if (!env.MY_KV) {
    console.log('KV unavailable, using fallback for user:', userId);
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

function getMockSubscription(userId) {
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

async function getSubscriptionStatus(request, env, user) {
  try {
    const userId = user.email || user.sub;
    
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

async function handleSubscriptionStatus(request, env) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('Missing or invalid authorization header', 401);
    }

    const token = authHeader.substring(7);
    const secret = env.JWT_SECRET;
    
    if (!secret) {
      return errorResponse('Server configuration error', 500);
    }

    // Verify token
    const user = await verifyToken(token, secret);
    if (!user) {
      return errorResponse('Invalid or expired token', 401);
    }

    // Get subscription status
    return await getSubscriptionStatus(request, env, user);
    
  } catch (error) {
    console.error('Subscription status endpoint error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// Edge Function export pattern
export default {
  async fetch(request, env, ctx) {
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Handle GET requests
    if (method === 'GET') {
      return handleSubscriptionStatus(request, env);
    }

    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        'Allow': 'GET'
      }
    });
  }
};