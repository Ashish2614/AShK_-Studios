import { describe, it, expect } from 'vitest';
import { getGmailCredentials, sendGmailMessage, isGmailConfigured } from '../src/lib/email/gmail';
import { sendOrderConfirmationReceipt, sendOwnerOrderAlert, handleContactNotification } from '../src/lib/email/service';
import { Order } from '../src/types';

describe('Gmail & Transactional Email Services', () => {
  it('loads configured Gmail OAuth client credentials safely', () => {
    const creds = getGmailCredentials();
    expect(creds.userEmail).toContain('@');
    expect(typeof isGmailConfigured()).toBe('boolean');
  });

  it('safely handles email dispatch without crashing or throwing exceptions', async () => {
    const fakeOrder: Order = {
      id: 'test_order_123',
      orderReference: 'ASHK-TEST-9999',
      customerName: 'Aarav Deshmukh',
      customerEmail: 'aarav.deshmukh@example.com',
      amountPaise: 480000,
      currency: 'INR',
      provider: 'razorpay',
      status: 'paid',
      subtotalPaise: 480000,
      shippingPaise: 0,
      taxPaise: 86400,
      items: [
        {
          productId: 'ashk-bed-01',
          productTitle: 'Estate Organic Cotton Bedding Set',
          unitPricePaise: 480000,
          quantity: 1,
          lineTotalPaise: 480000
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const receiptResult = await sendOrderConfirmationReceipt(fakeOrder);
    expect(receiptResult).toBe(true);

    const alertResult = await sendOwnerOrderAlert(fakeOrder);
    expect(alertResult).toBe(true);
  });

  it('handles contact notification dispatch safely', async () => {
    const contactData = {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+919876543210',
      message: 'Looking to purchase 10 luggage racks for our Coorg estate homestay.'
    };

    const result = await handleContactNotification(contactData);
    expect(result).toHaveProperty('ownerSent');
    expect(result).toHaveProperty('customerSent');
  });
});
