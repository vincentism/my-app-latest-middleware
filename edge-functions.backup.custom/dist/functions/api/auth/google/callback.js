/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { errorResponse } from "../../../lib/utils.js";
import { createToken } from "../../../lib/auth.js";

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

export async function onRequestGet({ request, env }) {
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

        const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, JWT_SECRET } = env;
        
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