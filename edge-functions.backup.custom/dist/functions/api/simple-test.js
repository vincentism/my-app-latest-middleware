// Test function with imports to isolate the issue
import { errorResponse } from '../lib/utils.js';

export async function onRequestGet(context) {
    try {
        return new Response(JSON.stringify({ 
            message: "Test with imports successful",
            timestamp: new Date().toISOString(),
            hasErrorResponse: typeof errorResponse === 'function'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return errorResponse('Test failed: ' + error.message, 500);
    }
}