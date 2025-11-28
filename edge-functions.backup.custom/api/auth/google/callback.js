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

async function createToken(payload, secret) {
  // Simple JWT creation for Edge Function
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  );
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

async function verifyGoogleIdToken(idToken, clientId) {
    // For simplicity in this Edge Function environment without heavy dependencies,
    // we will use Google's tokeninfo endpoint for verification.
    const verificationUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const response = await fetch(verificationUrl);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || "ID token verification failed.");
    }

    if (data.aud !== clientId) {
        throw new Error("Token audience does not match client ID.");
    }

    if (data.iss !== 'https://accounts.google.com' && data.iss !== 'accounts.google.com') {
         throw new Error("Invalid token issuer.");
    }

    return data; // contains email, name, etc.
}

async function handleGoogleCallback(request, env) {
  const redirectToError = (message) => {
    const url = new URL(request.url);
    url.pathname = '/';
    url.search = '';
    url.hash = `#/auth/callback?error=${encodeURIComponent(message)}`;
    return new Response(null, { status: 302, headers: { 'Location': url.toString() } });
  };

  try {
    if (!env) {
      console.error("Server environment is not available.");
      return redirectToError("Server configuration error.");
    }

    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, JWT_SECRET, MY_KV } = env;
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI || !JWT_SECRET) {
      console.error("Google OAuth or JWT environment variables are not set.");
      return redirectToError("Server configuration error for Google login.");
    }

    if (!MY_KV) {
      console.error("KV storage is not configured.");
      return redirectToError("Server storage is not configured.");
    }

    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      throw new Error("Authorization code is missing from Google callback.");
    }

    // Exchange authorization code for tokens
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new Error(tokenData.error_description || "Failed to exchange authorization code for token.");
    }
    
    const { id_token } = tokenData;
    const profile = await verifyGoogleIdToken(id_token, GOOGLE_CLIENT_ID);
    
    if (!profile.email) {
      throw new Error("Could not retrieve email from Google profile.");
    }

    const userKey = `user:${profile.email.toLowerCase()}`;
    let user;
    const userJson = await MY_KV.get(userKey);

    if (userJson) {
      user = JSON.parse(userJson);
    } else {
      user = {
        email: profile.email.toLowerCase(),
        name: profile.name,
        subscription: { status: 'inactive', plan: null, expires: null },
        isAdmin: false,
      };
      await MY_KV.put(userKey, JSON.stringify(user));
    }

    const appTokenPayload = { email: user.email, isAdmin: user.isAdmin, iat: Date.now() };
    const appToken = await createToken(appTokenPayload, JWT_SECRET);

    // Redirect back to the frontend with token and user info in the hash
    const frontendUrl = new URL(request.url);
    frontendUrl.pathname = '/';
    frontendUrl.search = '';
    frontendUrl.hash = `#/auth/callback?token=${appToken}&user=${encodeURIComponent(JSON.stringify(user))}`;

    return new Response(null, {
      status: 302,
      headers: {
        'Location': frontendUrl.toString()
      }
    });

  } catch (e) {
    console.error("Google Callback Error:", e);
    return redirectToError(e.message || "An unknown error occurred");
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
      return handleGoogleCallback(request, env);
    }

    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        'Allow': 'GET'
      }
    });
  }
};