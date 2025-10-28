/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { errorResponse, jsonResponse } from '../../lib/utils.js';
import { requireAuthWithFallback } from '../../lib/middleware.js';
import { checkKVAvailability } from '../../lib/fallback.js';

async function createCheckoutSession(context) {
  const { request, env } = context;
  
  try {
    const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID } = env;
    
    if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
      return errorResponse("Stripe configuration is missing", 500);
    }

    // Check KV availability for better error handling
    const kvCheck = await checkKVAvailability(env);
    if (!kvCheck.available) {
      console.warn(`KV storage unavailable (${kvCheck.reason}), continuing with checkout creation`);
    }

    const body = await request.json();
    const { priceId = STRIPE_PRICE_ID } = body;
    
    // Create Stripe checkout session
    const checkoutData = {
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${new URL(request.url).origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/payment/cancel`,
      customer_email: context.user.email,
      metadata: {
        user_id: context.user.sub,
        user_email: context.user.email,
      },
    };

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(checkoutData).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Stripe API error:', error);
      return errorResponse("Failed to create checkout session", 500);
    }

    const session = await response.json();
    
    return jsonResponse({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
      kv_available: kvCheck.available,
    });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Provide more specific error messages based on error type
    if (error.message && error.message.includes('price')) {
      return errorResponse("Invalid pricing configuration", 400);
    } else if (error.message && error.message.includes('customer')) {
      return errorResponse("Customer information error", 400);
    } else if (error.message && error.message.includes('API key')) {
      return errorResponse("Payment service configuration error", 500);
    } else {
      return errorResponse("Failed to create checkout session. Please try again.", 500);
    }
  }
}

export const onRequestPost = requireAuthWithFallback(createCheckoutSession);

export async function onRequestOptions({ request }) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}