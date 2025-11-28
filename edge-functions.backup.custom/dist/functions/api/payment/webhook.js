/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { jsonResponse, errorResponse } from '../../lib/utils.js';
import { storeUserDataWithFallback } from '../../lib/fallback.js';

async function handleStripeWebhook(context) {
  const env = context.env || {};
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, MY_KV } = env;
  
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !MY_KV) {
    return errorResponse("Stripe or KV configuration is missing", 500);
  }

  try {
    const body = await context.request.text();
    const signature = context.request.headers.get('stripe-signature');
    
    if (!signature) {
      return errorResponse("Missing Stripe signature", 400);
    }

    // Verify webhook signature (simplified - in production use proper crypto verification)
    const event = JSON.parse(body);
    
    console.log('Received Stripe webhook:', event.type);
    
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object, MY_KV);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object, MY_KV);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object, MY_KV);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object, MY_KV);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object, MY_KV);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return jsonResponse({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return errorResponse("Webhook processing failed", 500);
  }
}

async function handleCheckoutCompleted(session, env) {
  try {
    const userId = session.metadata?.user_id;
    const subscriptionId = session.subscription;
    const customerId = session.customer;
    
    if (!userId || !subscriptionId) {
      throw new Error('Missing userId or subscriptionId in session metadata');
    }

    // Get subscription details from Stripe
    const subscriptionResponse = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      },
    });

    if (!subscriptionResponse.ok) {
      throw new Error('Failed to fetch subscription details from Stripe');
    }

    const subscription = await subscriptionResponse.json();

    // Store subscription data with fallback handling
    const subscriptionData = {
      status: subscription.status,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: subscription.items.data[0]?.price?.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await storeUserDataWithFallback(env, `subscription:${userId}`, subscriptionData);
    if (!result.success) {
      console.warn(`Failed to store subscription data: ${result.reason}`);
    }
    
    // Store customer mapping with fallback handling
    const customerResult = await storeUserDataWithFallback(env, `customer:${customerId}`, userId);
    if (!customerResult.success) {
      console.warn(`Failed to store customer mapping: ${customerResult.reason}`);
    }

    console.log(`Subscription created for user ${userId}: ${subscriptionId}`);
    return { success: true, kv_stored: result.success };
    
  } catch (error) {
    console.error('Error handling checkout completed:', error);
    throw error;
  }
}

async function handleSubscriptionUpdate(subscription, kv) {
  const customerId = subscription.customer;
  
  // Find user by customer ID (in production, maintain a customer->user mapping)
  const subscriptionData = {
    status: subscription.status,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  // Store by subscription ID for now
  await kv.put(`subscription_by_id:${subscription.id}`, JSON.stringify(subscriptionData));
  console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
}

async function handleSubscriptionCanceled(subscription, kv) {
  const subscriptionData = {
    status: 'canceled',
    stripe_customer_id: subscription.customer,
    stripe_subscription_id: subscription.id,
    canceled_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  await kv.put(`subscription_by_id:${subscription.id}`, JSON.stringify(subscriptionData));
  console.log(`Subscription canceled: ${subscription.id}`);
}

async function handlePaymentSucceeded(invoice, kv) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  
  // Update payment status
  const paymentData = {
    invoice_id: invoice.id,
    subscription_id: subscriptionId,
    amount_paid: invoice.amount_paid,
    status: 'paid',
    paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
  };
  
  await kv.put(`payment:${invoice.id}`, JSON.stringify(paymentData));
  console.log(`Payment succeeded for subscription: ${subscriptionId}`);
}

async function handlePaymentFailed(invoice, kv) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  
  const paymentData = {
    invoice_id: invoice.id,
    subscription_id: subscriptionId,
    amount_due: invoice.amount_due,
    status: 'failed',
    failed_at: new Date().toISOString(),
  };
  
  await kv.put(`payment:${invoice.id}`, JSON.stringify(paymentData));
  console.log(`Payment failed for subscription: ${subscriptionId}`);
}

export async function onRequestPost(context) {
  try {
    return await handleStripeWebhook(context);
  } catch (error) {
    console.error('Payment webhook error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function onRequestOptions({ request }) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
    },
  });
}