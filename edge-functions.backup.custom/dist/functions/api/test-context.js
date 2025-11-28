/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { errorResponse, jsonResponse } from '../../../lib/utils.js';

export async function onRequestGet(context) {
  try {
    // Test basic context access
    const { request, env } = context;
    
    // Check if env exists and has the expected structure
    const hasEnv = !!env;
    const hasJWTSecret = !!env?.JWT_SECRET;
    const hasKV = !!env?.MY_KV;
    
    // Check request structure
    const hasRequest = !!request;
    const hasHeaders = !!request?.headers;
    const hasURL = !!request?.url;
    
    return jsonResponse({
      success: true,
      message: 'Context structure test',
      context_analysis: {
        has_env: hasEnv,
        has_jwt_secret: hasJWTSecret,
        has_kv: hasKV,
        has_request: hasRequest,
        has_headers: hasHeaders,
        has_url: hasURL,
        env_keys: env ? Object.keys(env) : [],
        env_type: typeof env
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Context test error:', error);
    return errorResponse(`Context test failed: ${error.message}`, 500);
  }
}

export async function onRequestOptions({ request }) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}