/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { errorResponse } from "../../../lib/utils.js";

async function handleGet({ request, env }) {
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
        console.error("Error in /api/auth/google/redirect:", e);
        return errorResponse(`An unexpected error occurred: ${e.message}`, 500);
    }
}

export async function onRequest({ request, env }) {
    if (request.method === 'GET') {
        return handleGet({ request, env });
    }
    return new Response('Method Not Allowed', {
        status: 405,
        headers: {
            'Allow': 'GET'
        }
    });
}
