import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { verifyRazorpaySignature, verifyRazorpayWebhookSignature } from '../src/lib/payments/razorpay';
import { createPendingOrder, updateOrderStatus, recordWebhookEventIdempotently, getOrderByReference } from '../src/lib/orders/store';

describe('Payment Security & Webhook Resilience', () => {
  const testSecret = 'rzp_test_secret_key_12345';
  const orderId = 'order_test_999';
  const paymentId = 'pay_test_888';

  it('correctly validates a cryptographically authentic Razorpay signature', () => {
    // Generate valid HMAC SHA256 signature
    const validSignature = crypto
      .createHmac('sha256', testSecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = verifyRazorpaySignature(orderId, paymentId, validSignature, testSecret);
    expect(isValid).toBe(true);
  });

  it('rejects a forged or tampered Razorpay signature', () => {
    const forgedSignature = 'tampered_signature_hex_value_00000000000000000000000000000000';
    const isValid = verifyRazorpaySignature(orderId, paymentId, forgedSignature, testSecret);
    expect(isValid).toBe(false);
  });

  it('validates a valid Razorpay webhook signature against raw payload', () => {
    const webhookSecret = 'rzp_whsec_secret_abcdef';
    const rawPayload = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_123', amount: 480000 } } }
    });

    const validWebhookSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawPayload)
      .digest('hex');

    const isValid = verifyRazorpayWebhookSignature(rawPayload, validWebhookSig, webhookSecret);
    expect(isValid).toBe(true);
  });

  it('rejects a tampered Razorpay webhook payload or invalid signature', () => {
    const webhookSecret = 'rzp_whsec_secret_abcdef';
    const rawPayload = '{"event":"payment.captured"}';
    const invalidSig = 'invalid_signature_hex';

    const isValid = verifyRazorpayWebhookSignature(rawPayload, invalidSig, webhookSecret);
    expect(isValid).toBe(false);
  });

  it('prevents duplicate processing of the same webhook event ID (Idempotency)', async () => {
    const eventId = `evt_${Date.now()}_unique_test`;
    const firstCall = await recordWebhookEventIdempotently(eventId, 'stripe', 'checkout.session.completed', { id: eventId });
    const duplicateCall = await recordWebhookEventIdempotently(eventId, 'stripe', 'checkout.session.completed', { id: eventId });

    expect(firstCall).toBe(true);
    expect(duplicateCall).toBe(false); // Duplicate event must return false
  });

  it('guarantees that a verified paid order cannot be downgraded by a stale failure event', async () => {
    // Create a pending order
    const order = await createPendingOrder({
      customerName: 'Aarav Deshmukh',
      customerEmail: 'aarav@casamandovi.com',
      items: [{ productId: 'ashk-bed-01', quantity: 1 }],
      provider: 'razorpay'
    });

    expect(order.status).toBe('pending');

    // Transition to paid after verified payment
    const paidTransition = await updateOrderStatus(order.orderReference, 'paid', 'pay_verified_123');
    expect(paidTransition.success).toBe(true);
    expect(paidTransition.order?.status).toBe('paid');

    // Attempt to downgrade to 'failed' via a stale/out-of-order event
    const downgradeAttempt = await updateOrderStatus(order.orderReference, 'failed', 'pay_stale_999');
    expect(downgradeAttempt.success).toBe(false);
    expect(downgradeAttempt.message).toContain('Safety violation');

    // Verify order in store is still paid
    const currentOrder = await getOrderByReference(order.orderReference);
    expect(currentOrder?.status).toBe('paid');
  });
});
