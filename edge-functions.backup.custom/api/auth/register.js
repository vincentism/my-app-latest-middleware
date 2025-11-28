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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
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
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Handle POST requests
    if (method === 'POST') {
      return errorResponse("Email registration is disabled. Please use Google or a Web3 wallet to sign in.", 405);
    }

    return new Response('Not Found', { status: 404 });
  }
};
