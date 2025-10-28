/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { verifyMessage } from "https://esm.sh/ethers@6.11.1";

// Helper functions for Edge Function format
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

async function createToken(payload, secret) {
  // Simple JWT implementation for Edge Functions
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = await sign(`${encodedHeader}.${encodedPayload}`, secret);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

async function sign(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function getUserDataWithFallback(env, key) {
  try {
    if (env.MY_KV) {
      const data = await env.MY_KV.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (error) {
    console.warn('KV get failed:', error);
  }
  return null;
}

async function storeUserDataWithFallback(env, key, data) {
  try {
    if (env.MY_KV) {
      await env.MY_KV.put(key, JSON.stringify(data));
      return { success: true };
    }
  } catch (error) {
    console.warn('KV store failed:', error);
  }
  return { success: false, reason: 'KV_UNAVAILABLE' };
}

async function handleLogin(request, env) {
  try {
    const { message, signature, walletAddress } = await request.json();
    
    if (!message || !signature || !walletAddress) {
      return errorResponse("Missing required fields: message, signature, walletAddress", 400);
    }

    // Verify the signature
    const recoveredAddress = verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return errorResponse("Invalid signature", 401);
    }

    const { JWT_SECRET } = env;
    
    if (!JWT_SECRET) {
      return errorResponse("Server configuration error", 500);
    }

    // Check if user exists with fallback handling
    let user = await getUserDataWithFallback(env, `user:${walletAddress}`);

    if (!user) {
      // Create new user
      user = {
        id: walletAddress,
        wallet_address: walletAddress,
        email: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Store user data with fallback handling
      const storeResult = await storeUserDataWithFallback(env, `user:${walletAddress}`, user);
      if (!storeResult.success) {
        console.warn(`Failed to store new user data: ${storeResult.reason}`);
      }
    }

    // Create JWT token
    const token = await createToken({
      sub: walletAddress,
      wallet_address: walletAddress,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    }, JWT_SECRET);

    return jsonResponse({
      token,
      user: {
        id: user.id,
        wallet_address: user.wallet_address,
        email: user.email,
        created_at: user.created_at,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return errorResponse("Login failed", 500);
  }
}

// Edge Function export pattern
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Handle POST requests
    if (method === 'POST' && url.pathname === '/api/auth/login') {
      return handleLogin(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};
