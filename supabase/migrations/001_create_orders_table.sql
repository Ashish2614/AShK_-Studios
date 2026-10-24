-- =====================================================================
-- AShK Stays - Database Schema Migration: 001_create_orders_table.sql
-- Compatible with Supabase PostgreSQL
-- =====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_reference TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    amount INTEGER NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe')),
    provider_ref TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
    shipping_amount INTEGER NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
    tax_amount INTEGER NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_address JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    paid_at TIMESTAMPTZ
);

-- 2. Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_title TEXT NOT NULL,
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total INTEGER NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create payment_events table for idempotent webhook reconciliation
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT UNIQUE NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe')),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create contact_inquiries table for guest and host inquiries
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'responded', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Performance and Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_provider_ref ON public.orders(provider_ref);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_id ON public.payment_events(event_id);

-- 6. Trigger to automatically update updated_at on orders
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. Row Level Security (RLS) Policies
-- Strict isolation: Anonymous clients have NO direct select/insert/update/delete permissions.
-- All database operations MUST occur through trusted server-side code using the service_role key.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow service_role complete access
CREATE POLICY "Service role full access on orders" 
    ON public.orders FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on order_items" 
    ON public.order_items FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on payment_events" 
    ON public.payment_events FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on contact_inquiries" 
    ON public.contact_inquiries FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);
