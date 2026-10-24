import { Resend } from 'resend';
import { Order } from '../../types';
import { formatINR } from '../pricing/catalog';
import { ContactFormData } from '../validation/schemas';
import { sendGmailMessage } from './gmail';

let resendInstance: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'concierge@ashkstays.com';
const OWNER_EMAIL = process.env.OWNER_EMAIL || process.env.GMAIL_USER_EMAIL || 'ashishtring@gmail.com';

/**
 * Sends order receipt to customer upon verified payment.
 */
export async function sendOrderConfirmationReceipt(order: Order): Promise<boolean> {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #E8E3D9; font-family: 'Plus Jakarta Sans', sans-serif; color: #1F2421;">
        <strong>${item.productTitle}</strong><br/>
        <span style="font-size: 13px; color: #666;">Qty: ${item.quantity} × ${formatINR(item.unitPricePaise)}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #E8E3D9; text-align: right; font-family: 'Plus Jakarta Sans', sans-serif; color: #1F2421; font-weight: 600;">
        ${formatINR(item.lineTotalPaise)}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="background-color: #FBF9F5; font-family: 'Plus Jakarta Sans', Arial, sans-serif; margin: 0; padding: 40px 20px; color: #1F2421;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #E8E3D9; overflow: hidden;">
        <div style="background-color: #1B3B2B; padding: 32px 24px; text-align: center;">
          <h1 style="color: #FBF9F5; font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 26px; letter-spacing: 0.5px;">AShK Stays</h1>
          <p style="color: #E8E3D9; margin: 6px 0 0 0; font-size: 13px;">Feel at Home, Wherever You Stay</p>
        </div>

        <div style="padding: 32px 24px;">
          <h2 style="font-size: 20px; margin-top: 0; color: #1B3B2B;">Thank you for your order, ${order.customerName}.</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #4A5568;">
            Your payment has been verified and your order is confirmed. Our artisan partners are preparing your shipment with meticulous care.
          </p>

          <div style="background-color: #F8F6F0; padding: 16px; border-radius: 6px; margin: 24px 0;">
            <p style="margin: 0; font-size: 13px; color: #666;">Order Reference:</p>
            <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: bold; color: #1B3B2B; letter-spacing: 0.5px;">${order.orderReference}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="border-bottom: 2px solid #1B3B2B;">
                <th style="text-align: left; padding-bottom: 8px; font-size: 13px; text-transform: uppercase; color: #1B3B2B;">Item</th>
                <th style="text-align: right; padding-bottom: 8px; font-size: 13px; text-transform: uppercase; color: #1B3B2B;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding-top: 14px; font-size: 14px; color: #666;">Subtotal:</td>
                <td style="padding-top: 14px; text-align: right; font-size: 14px; color: #1F2421;">${formatINR(order.subtotalPaise)}</td>
              </tr>
              <tr>
                <td style="padding-top: 6px; font-size: 14px; color: #666;">Shipping:</td>
                <td style="padding-top: 6px; text-align: right; font-size: 14px; color: #1F2421;">${order.shippingPaise === 0 ? 'FREE' : formatINR(order.shippingPaise)}</td>
              </tr>
              <tr>
                <td style="padding-top: 6px; font-size: 14px; color: #666;">GST (18%):</td>
                <td style="padding-top: 6px; text-align: right; font-size: 14px; color: #1F2421;">${formatINR(order.taxPaise)}</td>
              </tr>
              <tr style="border-top: 1px solid #1B3B2B;">
                <td style="padding-top: 12px; font-size: 16px; font-weight: bold; color: #1B3B2B;">Total Amount:</td>
                <td style="padding-top: 12px; text-align: right; font-size: 18px; font-weight: bold; color: #1B3B2B;">${formatINR(order.amountPaise)}</td>
              </tr>
            </tfoot>
          </table>

          ${order.shippingAddress ? `
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E8E3D9;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; color: #1B3B2B;">Delivery Address</h4>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4A5568;">
                ${order.shippingAddress.fullName}<br/>
                ${order.shippingAddress.addressLine1} ${order.shippingAddress.addressLine2 || ''}<br/>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br/>
                ${order.shippingAddress.country}
              </p>
            </div>
          ` : ''}

          <div style="margin-top: 36px; padding: 20px; background-color: #F8F6F0; border-radius: 6px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #666;">Have questions about your order or customized homestay setup?</p>
            <p style="margin: 6px 0 0 0; font-size: 14px; font-weight: 600; color: #1B3B2B;">Email us at concierge@ashkstays.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Try sending via Gmail API first
  const gmailResult = await sendGmailMessage({
    to: order.customerEmail,
    subject: `Order Confirmed [${order.orderReference}] — AShK Stays`,
    html,
    fromName: 'AShK Stays Concierge'
  });

  if (gmailResult.success) {
    return true;
  }

  // 2. Fall back to Resend API
  const resend = getResendClient();
  if (resend) {
    try {
      await resend.emails.send({
        from: `AShK Stays Concierge <${FROM_EMAIL}>`,
        to: [order.customerEmail],
        subject: `Order Confirmed [${order.orderReference}] — AShK Stays`,
        html
      });
      return true;
    } catch (err) {
      console.warn('[Email Service] Resend fallback failed:', err);
    }
  }

  console.info(`[Email Service] Simulated receipt for order ${order.orderReference} to ${order.customerEmail}`);
  return true;
}

/**
 * Sends order alert to property / store owner.
 */
export async function sendOwnerOrderAlert(order: Order): Promise<boolean> {
  const html = `
    <h2>New Verified Order Received</h2>
    <p><strong>Order Ref:</strong> ${order.orderReference}</p>
    <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
    <p><strong>Amount:</strong> ${formatINR(order.amountPaise)} via ${order.provider.toUpperCase()}</p>
    <p><strong>Items:</strong> ${order.items.map(i => `${i.quantity}x ${i.productTitle}`).join(', ')}</p>
  `;

  // 1. Try Gmail API
  const gmailResult = await sendGmailMessage({
    to: OWNER_EMAIL,
    subject: `🔔 New Paid Order: ${order.orderReference} (${formatINR(order.amountPaise)})`,
    html,
    fromName: 'AShK Stays Orders'
  });

  if (gmailResult.success) {
    return true;
  }

  // 2. Try Resend
  const resend = getResendClient();
  if (resend) {
    try {
      await resend.emails.send({
        from: `AShK Stays Orders <${FROM_EMAIL}>`,
        to: [OWNER_EMAIL],
        subject: `🔔 New Paid Order: ${order.orderReference} (${formatINR(order.amountPaise)})`,
        html
      });
      return true;
    } catch (err) {
      console.warn('[Email Service] Resend alert failed:', err);
    }
  }

  console.info(`[Email Service] Simulated owner alert for ${order.orderReference} to ${OWNER_EMAIL}`);
  return true;
}

/**
 * Sends contact enquiry notification to owner & acknowledgement to customer.
 */
export async function handleContactNotification(inquiry: ContactFormData): Promise<{ ownerSent: boolean; customerSent: boolean; error?: string }> {
  let ownerSent = false;
  let customerSent = false;

  const ownerHtml = `
    <h3>New Homestay Inquiry</h3>
    <p><strong>Name:</strong> ${inquiry.name}</p>
    <p><strong>Email:</strong> ${inquiry.email}</p>
    <p><strong>Phone:</strong> ${inquiry.phone || 'Not provided'}</p>
    <p><strong>Message:</strong></p>
    <blockquote style="background: #f8f8f8; padding: 12px; border-left: 3px solid #1B3B2B;">
      ${inquiry.message.replace(/\n/g, '<br/>')}
    </blockquote>
  `;

  const customerHtml = `
    <div style="font-family: sans-serif; color: #1F2421; padding: 20px;">
      <h2 style="color: #1B3B2B;">Greetings from AShK Stays</h2>
      <p>Dear ${inquiry.name},</p>
      <p>Thank you for reaching out to us. We have received your message regarding homestay products and hospitality experiences. A member of our concierge team will respond within 24 hours.</p>
      <br/>
      <p>Warm regards,<br/><strong>AShK Stays Team</strong></p>
    </div>
  `;

  // 1. Try Gmail API for owner alert
  const gmailOwnerResult = await sendGmailMessage({
    to: OWNER_EMAIL,
    subject: `📩 New Homestay Inquiry from ${inquiry.name}`,
    html: ownerHtml,
    replyTo: inquiry.email,
    fromName: 'AShK Stays Inquiries'
  });
  if (gmailOwnerResult.success) {
    ownerSent = true;
  }

  // 2. Try Gmail API for customer acknowledgement
  const gmailCustomerResult = await sendGmailMessage({
    to: inquiry.email,
    subject: `Thank you for contacting AShK Stays`,
    html: customerHtml,
    fromName: 'AShK Stays Hospitality'
  });
  if (gmailCustomerResult.success) {
    customerSent = true;
  }

  // Fallback to Resend if Gmail failed
  const resend = getResendClient();
  if (resend) {
    if (!ownerSent) {
      try {
        await resend.emails.send({
          from: `AShK Stays Inquiries <${FROM_EMAIL}>`,
          to: [OWNER_EMAIL],
          replyTo: inquiry.email,
          subject: `📩 New Homestay Inquiry from ${inquiry.name}`,
          html: ownerHtml
        });
        ownerSent = true;
      } catch (err) {
        console.warn('Resend owner inquiry failed:', err);
      }
    }

    if (!customerSent) {
      try {
        await resend.emails.send({
          from: `AShK Stays Hospitality <${FROM_EMAIL}>`,
          to: [inquiry.email],
          subject: `Thank you for contacting AShK Stays`,
          html: customerHtml
        });
        customerSent = true;
      } catch (err) {
        console.warn('Resend customer acknowledgement failed:', err);
      }
    }
  }

  if (!ownerSent && !customerSent) {
    console.warn(`[Email Service] Live email delivery deferred for ${inquiry.email}: ${gmailOwnerResult.error || 'No active email provider'}`);
  }

  return { ownerSent, customerSent, error: (!ownerSent && gmailOwnerResult.error) ? gmailOwnerResult.error : undefined };
}
