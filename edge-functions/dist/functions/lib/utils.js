/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ message }, status);
}

// Handle CORS preflight requests for browser compatibility.
export function handleOptions(request) {
    // A preflight request is an OPTIONS request with specific headers.
    if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
    ) {
        // This is a preflight request. Respond with the appropriate CORS headers.
        return new Response(null, {
            status: 204, // 204 No Content is standard for preflight responses
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow any origin
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "86400", // Cache preflight for 1 day
            },
        });
    } else {
        // This is a simple OPTIONS request, not a preflight.
        // Inform the client what methods are allowed.
        return new Response(null, {
            headers: {
                Allow: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            },
        });
    }
}