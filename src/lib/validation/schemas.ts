import { z } from 'zod';

export const RequestedItemSchema = z.object({
  productId: z.string().min(1, 'Product identifier is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(20, 'Quantity cannot exceed 20 per item')
});

export const CheckoutPayloadSchema = z.object({
  customerName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100, 'Name too long'),
  customerEmail: z.string().trim().email('Please enter a valid email address'),
  customerPhone: z.string().trim().min(10, 'Please enter a valid phone number (at least 10 digits)').max(18, 'Phone number too long'),
  addressLine1: z.string().trim().max(200).optional(),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().max(20).optional(),
  country: z.string().trim().default('India'),
  provider: z.enum(['razorpay', 'stripe']),
  items: z.array(RequestedItemSchema).min(1, 'Order must contain at least one product'),
  termsAccepted: z.literal(true, {
    message: 'You must accept the terms of service and privacy policy to continue'
  })
});

export type CheckoutPayload = z.infer<typeof CheckoutPayloadSchema>;

export const ContactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  email: z.string().trim().email('Please provide a valid email address'),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters'),
  website: z.string().max(0, 'Spam honeypot detected').optional().or(z.literal('')) // Honeypot field
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export const RazorpayVerificationSchema = z.object({
  orderReference: z.string().min(1, 'Order reference is required'),
  razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
  razorpay_signature: z.string().min(1, 'Razorpay signature is required')
});
