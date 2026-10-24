import { describe, it, expect } from 'vitest';
import { ContactFormSchema } from '../src/lib/validation/schemas';
import { checkRateLimit } from '../src/lib/security/rateLimiter';

describe('Contact Form & Security Validation', () => {
  it('validates a correct contact submission', () => {
    const validData = {
      name: 'Radhika Menon',
      email: 'radhika.menon@example.com',
      phone: '+919876543210',
      message: 'We are setting up a 4-bedroom heritage homestay in Coorg and would like a quote for linens and brass keys.',
      website: '' // empty honeypot
    };

    const result = ContactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects submissions with invalid email formats', () => {
    const invalidEmailData = {
      name: 'Vikram Rao',
      email: 'not-an-email',
      message: 'Inquiring about plantation luggage racks.'
    };

    const result = ContactFormSchema.safeParse(invalidEmailData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it('rejects submissions with missing required fields or short messages', () => {
    const shortData = {
      name: '',
      email: 'valid@example.com',
      message: 'Hi' // Less than 10 characters
    };

    const result = ContactFormSchema.safeParse(shortData);
    expect(result.success).toBe(false);
  });

  it('rejects submissions with excessive input lengths', () => {
    const excessiveNameData = {
      name: 'A'.repeat(150), // exceeds 100 max
      email: 'valid@example.com',
      message: 'Valid inquiry message for homestay consulting.'
    };

    const result = ContactFormSchema.safeParse(excessiveNameData);
    expect(result.success).toBe(false);
  });

  it('detects and rejects automated spam via honeypot field', () => {
    const spamBotData = {
      name: 'Spam Bot',
      email: 'spammer@botnet.org',
      message: 'Check out this commercial crypto link.',
      website: 'http://spam-link.ru' // Honeypot filled by bot
    };

    const result = ContactFormSchema.safeParse(spamBotData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.website).toBeDefined();
    }
  });

  it('enforces rate limiting on repeated requests from the same identifier', () => {
    const testIp = '192.168.1.100';
    // Limit to 3 requests per 10 seconds
    const r1 = checkRateLimit(`test_${testIp}`, 3, 10000);
    const r2 = checkRateLimit(`test_${testIp}`, 3, 10000);
    const r3 = checkRateLimit(`test_${testIp}`, 3, 10000);
    const r4 = checkRateLimit(`test_${testIp}`, 3, 10000);

    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(true);
    expect(r4.allowed).toBe(false); // 4th request must be blocked
    expect(r4.remaining).toBe(0);
  });
});
