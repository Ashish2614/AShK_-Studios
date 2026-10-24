export type PaymentProvider = 'razorpay' | 'stripe';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';

export type ProductCategory = 
  | 'bedding'
  | 'furniture'
  | 'brass-decor'
  | 'gourmet-hampers'
  | 'host-services';

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  pricePaise: number; // Stored in integer paise (1 INR = 100 paise)
  priceUsdCents: number; // For Stripe international checkout
  inStock: boolean;
  requiresShipping: boolean;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  leadTimeDays?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productTitle: string;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amountPaise: number;
  currency: 'INR' | 'USD';
  provider: PaymentProvider;
  providerRef?: string;
  status: OrderStatus;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
  subtotalPaise: number;
  shippingPaise: number;
  taxPaise: number;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface PricingCalculationResult {
  items: OrderItem[];
  subtotalPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  formattedSubtotal: string;
  formattedShipping: string;
  formattedTax: string;
  formattedTotal: string;
  requiresShipping: boolean;
  totalUsdCents?: number;
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}
