// Test function with auth middleware
import { requireAuthWithFallback } from '../lib/middleware.js';

async function testHandler(context) {
    const { user } = context;
    return new Response(JSON.stringify({ 
        message: "Auth middleware test successful",
        user: user ? { id: user.id, email: user.email } : null,
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

export const onRequestGet = requireAuthWithFallback(testHandler);