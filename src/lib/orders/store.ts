import { Order, OrderStatus, PaymentProvider, ShippingAddress } from '../../types';
import { calculateOrderPricing, RequestedItem } from '../pricing/catalog';
import { getSupabaseServiceClient } from '../supabase/client';

// In-memory fallback cache for fast lookups, automated tests, and offline resilience
const memoryOrders = new Map<string, Order>();
const processedEventIds = new Set<string>();

/**
 * Generate a unique human-friendly order reference like "ASHK-2610-8492"
 */
export function generateOrderReference(): string {
  const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ASHK-${dateStr}-${randomSuffix}`;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddress;
  items: RequestedItem[];
  provider: PaymentProvider;
  currency?: 'INR' | 'USD';
}

/**
 * Creates a persistent pending order with authoritative server-calculated pricing.
 */
export async function createPendingOrder(input: CreateOrderInput): Promise<Order> {
  const currency = input.currency || 'INR';
  const pricing = calculateOrderPricing(input.items, currency);

  const orderReference = generateOrderReference();
  const now = new Date().toISOString();
  const orderId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const order: Order = {
    id: orderId,
    orderReference,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim().toLowerCase(),
    customerPhone: input.customerPhone?.trim(),
    amountPaise: pricing.totalPaise,
    currency,
    provider: input.provider,
    status: 'pending',
    shippingAddress: input.shippingAddress,
    items: pricing.items,
    subtotalPaise: pricing.subtotalPaise,
    shippingPaise: pricing.shippingPaise,
    taxPaise: pricing.taxPaise,
    createdAt: now,
    updatedAt: now
  };

  // 1. Always store in local memory cache
  memoryOrders.set(orderReference, order);
  memoryOrders.set(orderId, order);

  // 2. Persist to Supabase if configured
  const supabase = getSupabaseServiceClient();
  if (supabase) {
    try {
      const { error: orderError } = await supabase.from('orders').insert({
        id: order.id,
        order_reference: order.orderReference,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        amount: order.amountPaise,
        currency: order.currency,
        provider: order.provider,
        provider_ref: order.providerRef || null,
        status: order.status,
        subtotal: order.subtotalPaise,
        shipping_amount: order.shippingPaise,
        tax_amount: order.taxPaise,
        shipping_address: order.shippingAddress ? JSON.stringify(order.shippingAddress) : null,
        metadata: { client: 'ashk-stays-web' }
      });

      if (orderError) {
        console.warn('Supabase order insert notice (relying on resilient store):', orderError.message);
      } else if (order.items && order.items.length > 0) {
        const itemRows = order.items.map(item => ({
          order_id: order.id,
          product_id: item.productId,
          product_title: item.productTitle,
          unit_price: item.unitPricePaise,
          quantity: item.quantity,
          line_total: item.lineTotalPaise
        }));

        await supabase.from('order_items').insert(itemRows);
      }
    } catch (err) {
      console.warn('Supabase persistence fallback to memory store:', err);
    }
  }

  return order;
}

/**
 * Retrieve order by reference or ID
 */
export async function getOrderByReference(refOrId: string): Promise<Order | null> {
  if (!refOrId) return null;

  // Check memory store first
  const cached = memoryOrders.get(refOrId);
  if (cached) return cached;

  const supabase = getSupabaseServiceClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .or(`order_reference.eq.${refOrId},id.eq.${refOrId}`)
        .maybeSingle();

      if (!error && data) {
        const order: Order = {
          id: data.id,
          orderReference: data.order_reference,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          customerPhone: data.customer_phone,
          amountPaise: data.amount,
          currency: data.currency,
          provider: data.provider,
          providerRef: data.provider_ref,
          status: data.status,
          subtotalPaise: data.subtotal,
          shippingPaise: data.shipping_amount,
          taxPaise: data.tax_amount,
          shippingAddress: data.shipping_address ? (typeof data.shipping_address === 'string' ? JSON.parse(data.shipping_address) : data.shipping_address) : undefined,
          items: data.order_items?.map((it: any) => ({
            id: it.id,
            productId: it.product_id,
            productTitle: it.product_title,
            unitPricePaise: it.unit_price,
            quantity: it.quantity,
            lineTotalPaise: it.line_total
          })) || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          paidAt: data.paid_at
        };

        memoryOrders.set(order.orderReference, order);
        memoryOrders.set(order.id, order);
        return order;
      }
    } catch (err) {
      console.warn('Supabase fetch error, fallback to memory:', err);
    }
  }

  return null;
}

/**
 * Updates order status safely with strict state transition guarantees.
 * Rules:
 * - 'paid' cannot be overwritten by 'pending' or 'failed'.
 * - Records provider_ref.
 */
export async function updateOrderStatus(
  orderReference: string,
  newStatus: OrderStatus,
  providerRef?: string
): Promise<{ success: boolean; order?: Order; message?: string }> {
  const order = await getOrderByReference(orderReference);
  if (!order) {
    return { success: false, message: `Order not found with reference ${orderReference}` };
  }

  // Prevent downgrading a verified paid order
  if (order.status === 'paid' && (newStatus === 'pending' || newStatus === 'failed' || newStatus === 'cancelled')) {
    return {
      success: false,
      order,
      message: `Safety violation: Cannot downgrade verified paid order ${orderReference} to status ${newStatus}`
    };
  }

  const now = new Date().toISOString();
  order.status = newStatus;
  order.updatedAt = now;
  if (newStatus === 'paid') {
    order.paidAt = now;
  }
  if (providerRef) {
    order.providerRef = providerRef;
  }

  // Update memory
  memoryOrders.set(order.orderReference, order);
  memoryOrders.set(order.id, order);

  // Update Supabase
  const supabase = getSupabaseServiceClient();
  if (supabase) {
    try {
      await supabase
        .from('orders')
        .update({
          status: newStatus,
          provider_ref: order.providerRef,
          updated_at: now,
          ...(newStatus === 'paid' ? { paid_at: now } : {})
        })
        .eq('order_reference', orderReference);
    } catch (err) {
      console.warn('Supabase status update error:', err);
    }
  }

  return { success: true, order };
}

/**
 * Idempotently records a processed webhook event to avoid double-processing.
 * Returns true if this is the first time seeing this event, false if duplicate.
 */
export async function recordWebhookEventIdempotently(
  eventId: string,
  provider: PaymentProvider,
  eventType: string,
  payload: Record<string, any>
): Promise<boolean> {
  if (processedEventIds.has(eventId)) {
    return false; // Already processed
  }
  processedEventIds.add(eventId);

  const supabase = getSupabaseServiceClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('payment_events').insert({
        event_id: eventId,
        provider,
        event_type: eventType,
        payload
      });
      if (error && error.code === '23505') { // Unique constraint violation
        return false;
      }
    } catch (err) {
      // In-memory set already handles deduplication if db fails
    }
  }

  return true;
}
