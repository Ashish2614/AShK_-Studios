import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { PRODUCTS, PRODUCT_MAP, calculateOrderPricing } from './lib/pricing/catalog';
import { CheckoutPayloadSchema, ContactFormSchema, RazorpayVerificationSchema } from './lib/validation/schemas';
import { createPendingOrder, getOrderByReference, updateOrderStatus, recordWebhookEventIdempotently } from './lib/orders/store';
import { createRazorpayOrder, verifyRazorpaySignature, verifyRazorpayWebhookSignature } from './lib/payments/razorpay';
import { createStripeCheckoutSession, constructStripeWebhookEvent } from './lib/payments/stripe';
import { sendOrderConfirmationReceipt, sendOwnerOrderAlert, handleContactNotification } from './lib/email/service';
import { 
  getGmailAccessToken, 
  sendGmailMessage, 
  getGmailCredentials, 
  isAppPasswordConfigured,
  setLiveAppPassword,
  setLiveRefreshToken,
  getGoogleOAuthUrl,
  exchangeAuthCodeForTokens
} from './lib/email/gmail';
import { checkRateLimit } from './lib/security/rateLimiter';
import { getSupabaseServiceClient } from './lib/supabase/client';

dotenv.config();

export interface StoredInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  deliveryStatus: 'sent_gmail' | 'sent_fallback' | 'logged';
}

export const inquiriesStore: StoredInquiry[] = [];

// Helper for client IP
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

const app = express();

// Trust proxy for rate limiting behind reverse proxies (Vercel, Cloudflare, etc.)
app.set('trust proxy', 1);

// Raw body parser for webhooks (Must be mounted before express.json())
app.use('/api/webhooks', express.raw({ type: '*/*' }));
app.use('/webhooks', express.raw({ type: '*/*' }));

// JSON parser for regular API requests
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Create modular API router
const router = express.Router();

// 1. Get all products
router.get('/products', (req: Request, res: Response) => {
  const { category } = req.query;
  if (category && typeof category === 'string' && category !== 'all') {
    const filtered = PRODUCTS.filter(p => p.category === category);
    return res.json({ products: filtered });
  }
  return res.json({ products: PRODUCTS });
});

// 2. Get product by slug
router.get('/products/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = PRODUCTS.find(p => p.slug === slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ product });
});

// 3. Calculate authoritative pricing
router.post('/pricing/calculate', (req: Request, res: Response) => {
  try {
    const { items, currency } = req.body;
    const result = calculateOrderPricing(items, currency || 'INR');
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Pricing calculation failed' });
  }
});

// 4. Create Razorpay order & pending database record
router.post('/checkout/razorpay', async (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`checkout_${clientIp}`, 15, 60 * 1000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many checkout attempts. Please wait a moment.' });
  }

  const parseResult = CheckoutPayloadSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parseResult.error.flatten().fieldErrors
    });
  }

  const payload = parseResult.data;

  try {
    const order = await createPendingOrder({
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.addressLine1 ? {
        fullName: payload.customerName,
        email: payload.customerEmail,
        phone: payload.customerPhone,
        addressLine1: payload.addressLine1,
        addressLine2: payload.addressLine2,
        city: payload.city || '',
        state: payload.state || '',
        postalCode: payload.postalCode || '',
        country: payload.country || 'India'
      } : undefined,
      items: payload.items,
      provider: 'razorpay',
      currency: 'INR'
    });

    const razorpayOrder = await createRazorpayOrder(order);

    return res.json({
      orderReference: order.orderReference,
      razorpayOrderId: razorpayOrder.id,
      amountPaise: order.amountPaise,
      currency: 'INR',
      keyId: razorpayOrder.keyId,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone
      },
      isTestMode: razorpayOrder.isTestMode
    });
  } catch (err: any) {
    console.error('Razorpay checkout initialization error:', err);
    return res.status(500).json({ error: err.message || 'Failed to initialize payment' });
  }
});

// 5. Verify Razorpay client payment signature
router.post('/checkout/razorpay/verify', async (req: Request, res: Response) => {
  const parseResult = RazorpayVerificationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid verification payload' });
  }

  const { orderReference, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parseResult.data;

  const isValid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValid) {
    await updateOrderStatus(orderReference, 'failed', razorpay_payment_id);
    return res.status(400).json({ error: 'Cryptographic signature verification failed' });
  }

  const updateResult = await updateOrderStatus(orderReference, 'paid', razorpay_payment_id);
  if (!updateResult.success || !updateResult.order) {
    return res.status(500).json({ error: updateResult.message || 'Failed to update order state' });
  }

  const order = updateResult.order;

  sendOrderConfirmationReceipt(order).catch(err => console.error('Receipt send failed:', err));
  sendOwnerOrderAlert(order).catch(err => console.error('Owner alert send failed:', err));

  return res.json({
    success: true,
    orderReference: order.orderReference,
    status: order.status
  });
});

// 6. Create Stripe Checkout Session
router.post('/checkout/stripe', async (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`stripe_checkout_${clientIp}`, 15, 60 * 1000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many checkout attempts. Please wait a moment.' });
  }

  const parseResult = CheckoutPayloadSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parseResult.error.flatten().fieldErrors
    });
  }

  const payload = parseResult.data;
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  try {
    const order = await createPendingOrder({
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.addressLine1 ? {
        fullName: payload.customerName,
        email: payload.customerEmail,
        phone: payload.customerPhone,
        addressLine1: payload.addressLine1,
        addressLine2: payload.addressLine2,
        city: payload.city || '',
        state: payload.state || '',
        postalCode: payload.postalCode || '',
        country: payload.country || 'India'
      } : undefined,
      items: payload.items,
      provider: 'stripe',
      currency: 'INR'
    });

    const session = await createStripeCheckoutSession(order, baseUrl);

    return res.json({
      orderReference: order.orderReference,
      url: session.url,
      sessionId: session.sessionId,
      isTestMode: session.isTestMode
    });
  } catch (err: any) {
    console.error('Stripe checkout session error:', err);
    return res.status(500).json({ error: err.message || 'Failed to initialize international checkout' });
  }
});

// 7. Razorpay Webhook Handler
router.post('/webhooks/razorpay', async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const rawBody = req.body;

  if (!signature) {
    return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
  }

  const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  try {
    const event = JSON.parse(rawBody.toString('utf8'));
    const eventId = event.event_id || event.id || `rzp_evt_${Date.now()}`;

    const isNew = await recordWebhookEventIdempotently(eventId, 'razorpay', event.event, event);
    if (!isNew) {
      return res.status(200).json({ received: true, message: 'Event already processed' });
    }

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderRef = paymentEntity?.notes?.orderReference || paymentEntity?.description;
      const paymentId = paymentEntity?.id;

      if (orderRef) {
        const updateResult = await updateOrderStatus(orderRef, 'paid', paymentId);
        if (updateResult.success && updateResult.order) {
          sendOrderConfirmationReceipt(updateResult.order).catch(console.error);
          sendOwnerOrderAlert(updateResult.order).catch(console.error);
        }
      }
    } else if (event.event === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderRef = paymentEntity?.notes?.orderReference;
      if (orderRef) {
        await updateOrderStatus(orderRef, 'failed', paymentEntity?.id);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Razorpay webhook processing error:', err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

// 8. Stripe Webhook Handler
router.post('/webhooks/stripe', async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  const rawBody = req.body;

  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  const event = constructStripeWebhookEvent(rawBody, signature);
  if (!event) {
    return res.status(400).json({ error: 'Invalid Stripe webhook signature' });
  }

  const isNew = await recordWebhookEventIdempotently(event.id, 'stripe', event.type, event as any);
  if (!isNew) {
    return res.status(200).json({ received: true, message: 'Duplicate event ignored' });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const orderRef = session.client_reference_id || session.metadata?.orderReference;
      const paymentIntentId = session.payment_intent || session.id;

      if (orderRef) {
        const updateResult = await updateOrderStatus(orderRef, 'paid', paymentIntentId);
        if (updateResult.success && updateResult.order) {
          sendOrderConfirmationReceipt(updateResult.order).catch(console.error);
          sendOwnerOrderAlert(updateResult.order).catch(console.error);
        }
      }
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object as any;
      const orderRef = session.client_reference_id;
      if (orderRef) {
        await updateOrderStatus(orderRef, 'cancelled');
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Stripe webhook handling error:', err);
    return res.status(500).json({ error: 'Stripe webhook error' });
  }
});

// 9. Contact Inquiry Submission
router.post('/contact', async (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`contact_${clientIp}`, 10, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: `Too many submissions. Please wait ${rateLimit.resetInSeconds} seconds before sending another message.` });
  }

  const parseResult = ContactFormSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parseResult.error.flatten().fieldErrors
    });
  }

  const data = parseResult.data;

  // Honeypot check: 'website' field must be empty
  if (data.website && data.website.length > 0) {
    console.warn(`Spam honeypot triggered from ${clientIp}`);
    return res.status(400).json({ error: 'Automated spam detected' });
  }

  // Record in memory store
  const inquiryRecord: StoredInquiry = {
    id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    message: data.message,
    createdAt: new Date().toISOString(),
    deliveryStatus: 'logged'
  };
  inquiriesStore.unshift(inquiryRecord);

  // Persist inquiry to Supabase if available
  const supabase = getSupabaseServiceClient();
  if (supabase) {
    try {
      await supabase.from('contact_inquiries').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message
      });
    } catch (err) {
      console.warn('Contact inquiry DB storage warning:', err);
    }
  }

  // Send notifications via Gmail / Resend
  const notificationResult = await handleContactNotification(data);
  if (notificationResult.ownerSent) {
    inquiryRecord.deliveryStatus = isAppPasswordConfigured() ? 'sent_gmail' : 'sent_fallback';
  } else {
    inquiryRecord.deliveryStatus = 'logged';
  }

  return res.json({
    success: true,
    message: notificationResult.ownerSent
      ? 'Thank you for reaching out. The AShK Stays team has received your message and will respond promptly.'
      : 'Your inquiry has been received and saved in the Owner Concierge Inbox. (Direct Gmail notification is pending owner credential activation).',
    emailDelivered: notificationResult.ownerSent,
    inquiryId: inquiryRecord.id
  });
});

// List all received inquiries (For host/owner review)
router.get('/inquiries', (req: Request, res: Response) => {
  return res.json({ inquiries: inquiriesStore });
});

// 10. Fetch Order details for verification / result page
router.get('/orders/:reference', async (req: Request, res: Response) => {
  const { reference } = req.params;
  const order = await getOrderByReference(reference);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.json({
    orderReference: order.orderReference,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    amountPaise: order.amountPaise,
    currency: order.currency,
    subtotalPaise: order.subtotalPaise,
    shippingPaise: order.shippingPaise,
    taxPaise: order.taxPaise,
    provider: order.provider,
    items: order.items,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt,
    paidAt: order.paidAt
  });
});

// 11. Gmail Status & Diagnostic Endpoint
router.get('/email/status', async (req: Request, res: Response) => {
  const creds = getGmailCredentials();
  const tokenResult = await getGmailAccessToken();
  const hasAppPassword = isAppPasswordConfigured();

  let activeMethod = 'none';
  if (hasAppPassword) {
    activeMethod = 'smtp_app_password';
  } else if (tokenResult.token) {
    activeMethod = 'google_oauth_2';
  }

  return res.json({
    provider: 'gmail',
    userEmail: creds.userEmail,
    activeMethod,
    hasAppPassword,
    connected: Boolean(tokenResult.token || hasAppPassword),
    oauthError: tokenResult.error || null,
    totalInquiriesReceived: inquiriesStore.length
  });
});

// 12. Dynamic Email Configuration Endpoint
router.post('/email/configure', async (req: Request, res: Response) => {
  const { appPassword, refreshToken } = req.body;

  if (appPassword !== undefined) {
    setLiveAppPassword(appPassword);
  }
  if (refreshToken !== undefined) {
    setLiveRefreshToken(refreshToken);
  }

  const tokenResult = await getGmailAccessToken();
  const hasAppPassword = isAppPasswordConfigured();

  return res.json({
    success: true,
    message: 'Email credentials updated successfully',
    hasAppPassword,
    oauthConnected: Boolean(tokenResult.token),
    oauthError: tokenResult.error || null
  });
});

// 13. Send Test Email
router.post('/email/test', async (req: Request, res: Response) => {
  const { to } = req.body;
  const creds = getGmailCredentials();
  const recipient = to || creds.userEmail;

  const result = await sendGmailMessage({
    to: recipient,
    subject: '✨ AShK Stays — Test Email via Gmail',
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; padding: 24px; color: #1F2421; background: #FBF9F5; border-radius: 8px; border: 1px solid #E8E3D9;">
        <h2 style="color: #1B3B2B; font-family: 'Playfair Display', Georgia, serif; margin-top: 0;">AShK Stays — Gmail Email Test</h2>
        <p>This is a live transactional confirmation sent to your inbox.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Recipient:</strong> ${recipient}</p>
        <p><strong>Sender:</strong> ${creds.userEmail}</p>
        <div style="background-color: #E8E3D9; height: 1px; margin: 20px 0;"></div>
        <p style="font-size: 12px; color: #666; margin: 0;">AShK Stays · Indiranagar, Bangalore & Coorg, Karnataka · <a href="https://ashkstays.com" style="color: #C87A55;">ashkstays.com</a></p>
      </div>
    `,
    fromName: 'AShK Stays Concierge'
  });

  return res.json(result);
});

// 14. Google OAuth Authorization Flow endpoints
router.get('/auth/google/url', (req: Request, res: Response) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;
  const url = getGoogleOAuthUrl(redirectUri);
  return res.json({ url, redirectUri });
});

router.get('/auth/google/callback', async (req: Request, res: Response) => {
  const { code, error } = req.query;
  if (error || !code || typeof code !== 'string') {
    return res.redirect(`/contact?auth_error=${encodeURIComponent(String(error || 'No authorization code returned'))}`);
  }

  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  const exchangeResult = await exchangeAuthCodeForTokens(code, redirectUri);
  if (exchangeResult.success) {
    return res.redirect('/contact?auth=success');
  } else {
    return res.redirect(`/contact?auth_error=${encodeURIComponent(exchangeResult.error || 'Token exchange failed')}`);
  }
});

// Mount router at both '/api' (for local and full-path serverless) and at root '/' (for serverless environments where /api is stripped)
app.use('/api', router);
app.use(router);

export default app;
