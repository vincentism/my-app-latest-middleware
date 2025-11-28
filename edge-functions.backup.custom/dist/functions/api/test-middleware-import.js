/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { errorResponse, jsonResponse } from '../../../lib/utils.js';
import { requireAuthWithFallback } from '../../../lib/middleware.js';

async function testHandler(context) {
  const user = context.user;
  return jsonResponse({
    success: true,
    message: 'Middleware import test successful',
    user: user,
    timestamp: new Date().toISOString()
  });
}

export const onRequestGet = requireAuthWithFallback(testHandler);

export async function onRequestOptions({ request }) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}