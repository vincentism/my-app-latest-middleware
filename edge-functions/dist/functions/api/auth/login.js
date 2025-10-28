/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { jsonResponse, errorResponse } from "../../lib/utils.js";
import { createToken } from "../../lib/auth.js";
import { storeUserDataWithFallback, getUserDataWithFallback } from "../../lib/fallback.js";
import { verifyMessage } from "https://esm.sh/ethers@6.11.1";

async function handlePostRequest(context) {
  const { request, env } = context;
  
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


export async function onRequestPost(context) {
  const { request, env } = context;
  return handlePostRequest(request, env);
}

export async function onRequestOptions({ request }) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
