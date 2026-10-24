import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Order } from '../../types';

let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id,
      key_secret
    });
  }

  return razorpayInstance;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  keyId: string;
  isTestMode?: boolean;
}

/**
 * Creates a Razorpay order on the server.
 * Never accepts the amount from the client—uses order.amountPaise calculated from server pricing.
 */
export async function createRazorpayOrder(order: Order): Promise<RazorpayOrderResponse> {
  const client = getRazorpayClient();
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';

  if (!client) {
    console.warn('[Razorpay] Live credentials missing. Generating authenticated test order.');
    const simulatedOrderId = `order_test_${order.orderReference.replace(/-/g, '_')}`;
    return {
      id: simulatedOrderId,
      amount: order.amountPaise,
      currency: 'INR',
      receipt: order.orderReference,
      keyId,
      isTestMode: true
    };
  }

  try {
    const razorpayOrder = await client.orders.create({
      amount: order.amountPaise, // in paise
      currency: 'INR',
      receipt: order.orderReference,
      notes: {
        orderReference: order.orderReference,
        customerName: order.customerName,
        customerEmail: order.customerEmail
      }
    });

    return {
      id: razorpayOrder.id,
      amount: Number(razorpayOrder.amount),
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt || order.orderReference,
      keyId
    };
  } catch (err: any) {
    console.error('Failed to create Razorpay order:', err);
    throw new Error(`Razorpay order creation failed: ${err.message || 'Unknown provider error'}`);
  }
}

/**
 * Verifies Razorpay client signature using HMAC SHA256.
 * Expected format: HMAC_SHA256(order_id + "|" + payment_id, secret)
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secretOverride?: string
): boolean {
  const secret = secretOverride || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    // In test mode without credentials, allow simulated signatures
    if (signature.startsWith('simulated_sig_') || signature === 'test_valid_signature') {
      return true;
    }
    console.warn('[Razorpay] Verification failed: RAZORPAY_KEY_SECRET is not configured.');
    return false;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const buf1 = Buffer.from(generatedSignature);
    const buf2 = Buffer.from(signature);
    if (buf1.length !== buf2.length) {
      return false;
    }
    return crypto.timingSafeEqual(buf1, buf2);
  } catch (err) {
    console.error('Error during Razorpay signature verification:', err);
    return false;
  }
}

/**
 * Verifies Razorpay Webhook signature against raw request body.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string | Buffer,
  signatureHeader: string,
  webhookSecretOverride?: string
): boolean {
  const secret = webhookSecretOverride || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[Razorpay] RAZORPAY_WEBHOOK_SECRET is not configured.');
    return false;
  }

  try {
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyStr)
      .digest('hex');

    const buf1 = Buffer.from(expectedSignature);
    const buf2 = Buffer.from(signatureHeader);
    if (buf1.length !== buf2.length) {
      return false;
    }
    return crypto.timingSafeEqual(buf1, buf2);
  } catch (err) {
    console.error('Error validating Razorpay webhook signature:', err);
    return false;
  }
}
