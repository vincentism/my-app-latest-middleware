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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

async function handleGoogleRedirect(request, env) {
  try {
    if (!env) {
      return errorResponse("Server environment is not available.", 500);
    }
    
    const { GOOGLE_CLIENT_ID } = env;

    if (!GOOGLE_CLIENT_ID) {
      console.error("Google OAuth environment variables are not set.");
      return errorResponse("Server configuration error for Google login. Required environment variables are missing.", 500);
    }

    // Dynamically construct the redirect URI from the request URL
    const requestUrl = new URL(request.url);
    const redirectUri = `${requestUrl.origin}/api/auth/google/callback`;

    const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl.toString()
      }
    });
  } catch (e) {
    console.error("Error in Google redirect:", e);
    return errorResponse(`An unexpected error occurred: ${e.message}`, 500);
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
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Handle GET requests
    if (method === 'GET') {
      return handleGoogleRedirect(request, env);
    }

    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        'Allow': 'GET'
      }
    });
  }
};
