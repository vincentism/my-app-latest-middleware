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

// This list should be dynamically fetched or configured in a real application.
// The structure matches what's expected by the frontend and Chrome extension.
const servers = [
    { id: 'jp-tokyo', location: 'Tokyo, Japan', flag: '🇯🇵', domain: 'jp.proxy.privanet.com' },
    { id: 'us-nyc', location: 'New York, USA', flag: '🇺🇸', domain: 'us.proxy.privanet.com' },
    { id: 'uk-london', location: 'London, UK', flag: '🇬🇧', domain: 'uk.proxy.privanet.com' },
    { id: 'de-frankfurt', location: 'Frankfurt, DE', flag: '🇩🇪', domain: 'de.proxy.privanet.com' },
];

async function getProxyNodes(request, env) {
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

    // In a production scenario, you could filter servers based on the user's subscription plan.
    // For now, we return the full list to any authenticated user.
    return jsonResponse(servers);
    
  } catch (error) {
    console.error('Proxy nodes endpoint error:', error);
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
      return getProxyNodes(request, env);
    }

    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        'Allow': 'GET'
      }
    });
  }
};
