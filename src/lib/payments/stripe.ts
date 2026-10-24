import Stripe from 'stripe';
import { Order } from '../../types';

let stripeInstance: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2023-10-16' as any
    });
  }

  return stripeInstance;
}

export interface StripeSessionResponse {
  sessionId: string;
  url: string;
  isTestMode?: boolean;
}

/**
 * Creates a Stripe Checkout Session for international card payments.
 * Uses trusted server-side order pricing and line items.
 */
export async function createStripeCheckoutSession(
  order: Order,
  baseUrl: string
): Promise<StripeSessionResponse> {
  const stripe = getStripeClient();

  const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&ref=${order.orderReference}`;
  const cancelUrl = `${baseUrl}/checkout/cancelled?ref=${order.orderReference}`;

  if (!stripe) {
    console.warn('[Stripe] STRIPE_SECRET_KEY is not configured. Creating simulated session URL.');
    return {
      sessionId: `cs_test_${order.orderReference.replace(/-/g, '_')}`,
      url: `${baseUrl}/checkout/success?session_id=cs_test_mock&ref=${order.orderReference}`,
      isTestMode: true
    };
  }

  // Construct line items with server verified prices
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map(item => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.productTitle,
        metadata: {
          productId: item.productId
        }
      },
      unit_amount: item.unitPricePaise
    },
    quantity: item.quantity
  }));

  // Add shipping if applicable
  if (order.shippingPaise > 0) {
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Hospitality Shipping & Safe Packaging'
        },
        unit_amount: order.shippingPaise
      },
      quantity: 1
    });
  }

  // Add GST if applicable
  if (order.taxPaise > 0) {
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'GST (18% Goods & Services Tax)'
        },
        unit_amount: order.taxPaise
      },
      quantity: 1
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: order.customerEmail,
      client_reference_id: order.orderReference,
      metadata: {
        orderReference: order.orderReference,
        orderId: order.id,
        customerName: order.customerName
      },
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    if (!session.url) {
      throw new Error('Stripe session created without checkout URL');
    }

    return {
      sessionId: session.id,
      url: session.url
    };
  } catch (err: any) {
    console.error('Failed to create Stripe Checkout session:', err);
    throw new Error(`Stripe Checkout creation failed: ${err.message || 'Unknown error'}`);
  }
}

/**
 * Validates Stripe webhook event with cryptographic signature.
 */
export function constructStripeWebhookEvent(
  rawBody: string | Buffer,
  signatureHeader: string,
  secretOverride?: string
): Stripe.Event | null {
  const stripe = getStripeClient();
  const secret = secretOverride || process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    console.warn('[Stripe] Stripe client or STRIPE_WEBHOOK_SECRET missing.');
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(rawBody, signatureHeader, secret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return null;
  }
}
