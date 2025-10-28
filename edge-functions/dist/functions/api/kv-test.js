// Test function with auth middleware but simpler structure
import { requireAuthWithFallback } from '../lib/middleware.js';

async function simpleHandler(context) {
    return new Response(JSON.stringify({ 
        message: "Auth middleware test successful",
        user: context.user ? { id: context.user.id, email: context.user.email } : null,
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

export const onRequestGet = requireAuthWithFallback(simpleHandler);
