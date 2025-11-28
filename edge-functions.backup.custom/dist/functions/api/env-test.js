// Test function with same import structure as working functions
import { errorResponse } from '../lib/utils.js';

export async function onRequestGet(context) {
    try {
        return new Response(JSON.stringify({ 
            message: "Import test successful",
            hasErrorResponse: typeof errorResponse === 'function',
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            error: 'Test failed: ' + error.message 
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}