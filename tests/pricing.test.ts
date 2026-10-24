import { describe, it, expect } from 'vitest';
import { calculateOrderPricing, formatINR, FREE_SHIPPING_THRESHOLD_PAISE, STANDARD_SHIPPING_PAISE } from '../src/lib/pricing/catalog';

describe('Secure Pricing Architecture', () => {
  it('correctly calculates INR paise for a single item', () => {
    // Bedding is ₹4,800 = 480,000 paise
    const result = calculateOrderPricing([{ productId: 'ashk-bed-01', quantity: 1 }]);
    expect(result.subtotalPaise).toBe(480000);
    // Above free shipping threshold (₹2,500 = 250,000 paise), shipping is 0
    expect(result.shippingPaise).toBe(0);
    // 18% GST on 480000 = 86400 paise
    expect(result.taxPaise).toBe(86400);
    expect(result.totalPaise).toBe(480000 + 0 + 86400);
    expect(result.formattedTotal).toBe(formatINR(566400));
  });

  it('correctly calculates for multiple items and quantities', () => {
    const result = calculateOrderPricing([
      { productId: 'ashk-tea-01', quantity: 2 }, // 2 x 195,000 = 390,000
      { productId: 'ashk-brass-01', quantity: 1 } // 1 x 220,000 = 220,000
    ]);
    expect(result.subtotalPaise).toBe(610000);
    expect(result.shippingPaise).toBe(0);
    expect(result.taxPaise).toBe(Math.round(610000 * 0.18));
    expect(result.totalPaise).toBe(610000 + result.taxPaise);
  });

  it('applies standard shipping when under free shipping threshold', () => {
    // Single room mist is ₹1,450 = 145,000 paise (under 250,000 threshold)
    const result = calculateOrderPricing([{ productId: 'ashk-decor-03', quantity: 1 }]);
    expect(result.subtotalPaise).toBe(145000);
    expect(result.shippingPaise).toBe(STANDARD_SHIPPING_PAISE); // 25,000 paise
    expect(result.totalPaise).toBe(145000 + 25000 + Math.round(145000 * 0.18));
  });

  it('charges zero shipping for pure digital advisory services', () => {
    // Host consulting does not require physical shipping
    const result = calculateOrderPricing([{ productId: 'ashk-srv-01', quantity: 1 }]);
    expect(result.requiresShipping).toBe(false);
    expect(result.shippingPaise).toBe(0);
  });

  it('rejects invalid or non-existent product identifiers', () => {
    expect(() => {
      calculateOrderPricing([{ productId: 'non-existent-sku-999', quantity: 1 }]);
    }).toThrow(/Product not found/);
  });

  it('rejects non-positive, zero, or fractional quantities', () => {
    expect(() => {
      calculateOrderPricing([{ productId: 'ashk-bed-01', quantity: 0 }]);
    }).toThrow(/Invalid quantity/);

    expect(() => {
      calculateOrderPricing([{ productId: 'ashk-bed-01', quantity: -2 }]);
    }).toThrow(/Invalid quantity/);

    expect(() => {
      calculateOrderPricing([{ productId: 'ashk-bed-01', quantity: 2.5 as any }]);
    }).toThrow(/Invalid quantity/);
  });

  it('rejects excessive quantities exceeding maximum limit of 20', () => {
    expect(() => {
      calculateOrderPricing([{ productId: 'ashk-bed-01', quantity: 25 }]);
    }).toThrow(/Invalid quantity/);
  });

  it('enforces rounding rules for tax calculations', () => {
    // Item with odd price check: 165,000 * 0.18 = 29,700 paise exactly
    const result = calculateOrderPricing([{ productId: 'ashk-decor-02', quantity: 1 }]);
    expect(Number.isInteger(result.taxPaise)).toBe(true);
    expect(Number.isInteger(result.totalPaise)).toBe(true);
  });
});
