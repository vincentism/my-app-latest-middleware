/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { verifyToken } from './lib/auth.js';

// This function acts as the origin for all proxy subdomains (e.g., jp.proxy.privanet.com).
// Its job is to receive a request from the EdgeOne network and forward it to the
// intended destination on the internet.

const errorResponse = (message, status) => {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
};

export async function onRequest(context) {
    const { request, env } = context;
    const { JWT_SECRET } = env;

    if (!JWT_SECRET) {
        return errorResponse("JWT_SECRET environment variable is not set.", 500);
    }

    // 1. Authentication: Validate the short-lived proxy token.
    const proxyToken = request.headers.get('X-Proxy-Auth-Token');
    if (!proxyToken) {
        return errorResponse('Proxy authentication token is missing.', 401);
    }

    try {
        const payload = await verifyToken(proxyToken, JWT_SECRET);
        // Check for a valid payload and a specific claim to ensure it's a proxy token.
        if (!payload || !payload.proxy) {
            return errorResponse('Invalid or expired proxy token.', 401);
        }
    } catch (e) {
        return errorResponse('Proxy token verification failed.', 401);
    }
    
    // 2. Destination Forwarding:
    // A browser proxy request sends the Host header of the *destination* server.
    // We reconstruct the target URL from the incoming request's path, query, and Host header.
    const destinationHost = request.headers.get('Host');
    if (!destinationHost) {
        return errorResponse('Host header is missing, cannot determine destination.', 400);
    }

    const url = new URL(request.url);
    const destinationUrl = `https://${destinationHost}${url.pathname}${url.search}`;

    // 3. Create a new request to the final destination.
    // We need to create a new Headers object, filtering out headers specific to the proxy itself.
    const forwardedHeaders = new Headers();
    for (const [key, value] of request.headers.entries()) {
        const lowerKey = key.toLowerCase();
        // Do not forward the proxy auth token or the original host header from the edge node.
        if (lowerKey !== 'x-proxy-auth-token' && lowerKey !== 'host') {
            forwardedHeaders.append(key, value);
        }
    }
    // Set the correct Host header for the destination server.
    forwardedHeaders.set('Host', destinationHost);

    try {
        // Use fetch to send the request to the final destination.
        // IMPORTANT: The `body` of the original request needs to be passed through.
        // The `redirect: 'manual'` is important for a proxy to correctly handle redirects itself.
        const response = await fetch(destinationUrl, {
            method: request.method,
            headers: forwardedHeaders,
            body: request.body,
            redirect: 'manual'
        });
        
        // 4. Stream the response back to the client.
        // We need to return a new Response object with the body and headers from the destination server.
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });

    } catch (e) {
        console.error(`Proxy fetch error for ${destinationUrl}:`, e);
        return errorResponse(`Could not connect to the destination server: ${destinationHost}`, 502); // 502 Bad Gateway
    }
}
