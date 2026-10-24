# AShK Stays — Premium Indian Homestay Products & Services

A production-grade, full-stack web application for **AShK Stays**, an India-based business providing bespoke homestay linens, hand-carved teak furnishings, Moradabad heirloom brass hardware, estate breakfast hampers, and host consulting services.

Built with **React SPA**, **TypeScript**, **Tailwind CSS**, **Node.js Express backend**, **Supabase PostgreSQL**, **Razorpay (India UPI/Cards/Netbanking)**, **Stripe Checkout (International)**, **Resend (Transactional Emails)**, and **Vitest**.

---

## 1. Project Overview

AShK Stays caters to boutique homestays, plantation bungalows, and heritage retreats across India. The application features:
- **Canonical Server-Side Pricing Engine:** Stored in integer paise (1 INR = 100 paise) preventing price tampering and unsupported currencies.
- **Interactive Suite Walkthrough:** High-definition video walkthrough of the master oceanfront homestay suite with clickable product hotspots.
- **Dual Payment Architecture:**
  - **India:** Native Razorpay checkout supporting UPI (Google Pay, PhonePe, Paytm), RuPay, Indian cards, and Netbanking with HMAC-SHA256 signature verification.
  - **International:** Stripe Checkout Session integration for overseas cardholders.
- **Safe Order State Machine:** `pending` → `paid` (with terminal states `failed`, `cancelled`, `refunded`), strictly forbidding downgrades from stale or duplicate webhook events.
- **Idempotent Webhooks:** Cryptographic signature validation with event deduplication.
- **Transactional Notifications:** Resend branded HTML receipts for customers and instant order alerts for the store owner.
- **Enterprise Security:** Anti-spam honeypot fields, sliding-window rate limiters, security headers, and strict Row Level Security (RLS).

---

## 2. Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **Package Manager:** npm or bun

---

## 3. Installation Commands

```bash
# Clone the repository and enter the directory
git clone <your-repo-url>
cd ashk-stays

# Install all dependencies
npm install
```

---

## 4. Local Development

To run the development server with hot-reload and integrated Express API routes:

```bash
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 5. Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Populate `.env` with your actual service credentials.

---

## 6. Supabase Project Creation

1. Navigate to [Supabase](https://supabase.com) and create a new project.
2. Select an Indian cloud region (e.g. `ap-south-1` Mumbai) for minimum latency.
3. Once provisioned, copy the **Project URL**, **anon public key**, and **service_role secret key** from **Project Settings → API**.

---

## 7. Database Migrations

Apply the version-controlled SQL migration located in `supabase/migrations/001_create_orders_table.sql`:

1. Open the **SQL Editor** in your Supabase dashboard.
2. Paste the contents of `supabase/migrations/001_create_orders_table.sql`.
3. Click **Run**.
4. This creates:
   - `public.orders`
   - `public.order_items`
   - `public.payment_events` (for webhook idempotency)
   - `public.contact_inquiries`
   - Indexes and Row Level Security (RLS) policies.

---

## 8. Razorpay Test Account & API Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Toggle to **Test Mode** in the upper navigation bar.
3. Go to **Settings → API Keys** and generate a new key pair:
   - `Key ID` → Set as `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
   - `Key Secret` → Set as `RAZORPAY_KEY_SECRET`.

---

## 9. Razorpay Webhook URL & Secret Setup

1. In Razorpay Dashboard, navigate to **Settings → Webhooks → Add New Webhook**.
2. **Webhook URL:** `https://your-domain.com/api/webhooks/razorpay`
3. **Secret:** Enter a strong random secret and add it to `.env` as `RAZORPAY_WEBHOOK_SECRET`.
4. **Active Events:**
   - `payment.captured`
   - `payment.failed`
   - `order.paid`

---

## 10. Stripe Test Account & API Keys

1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com).
2. Ensure **Test Mode** is toggled ON.
3. Go to **Developers → API Keys**:
   - `Publishable key` (`pk_test_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` (`sk_test_...`) → `STRIPE_SECRET_KEY`

---

## 11. Stripe Checkout Configuration

AShK Stays uses server-side Stripe Checkout sessions. No client-side secret keys are required. The server constructs line items in INR from canonical server pricing and provides secure redirects.

---

## 12. Stripe Webhook Endpoint & Signing Secret

1. In Stripe Dashboard, navigate to **Developers → Webhooks → Add destination**.
2. **Endpoint URL:** `https://your-domain.com/api/webhooks/stripe`
3. **Events to listen for:**
   - `checkout.session.completed`
   - `checkout.session.expired`
4. Copy the **Signing secret** (`whsec_...`) and add it to `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 13. Resend API Key & Verified Sender Domain

1. Sign up at [Resend](https://resend.com).
2. Generate an API Key under **API Keys** and add it to `.env` as `RESEND_API_KEY`.
3. Add and verify your custom sending domain (e.g. `ashkstays.com`) in **Domains**.
4. Configure `RESEND_FROM_EMAIL` (e.g. `concierge@ashkstays.com`) and `OWNER_EMAIL`.

---

## 14. Local Webhook Testing

Use official CLI forwarders to test webhooks locally against `http://localhost:3000`:

```bash
# Razorpay Webhook forwarding (via ngrok or Razorpay CLI)
ngrok http 3000
# Update your Razorpay test webhook URL to your ngrok tunnel URL

# Stripe Webhook forwarding via Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 15. Automated Test Commands

Run the comprehensive unit and integration test suite:

```bash
npm run test
```

Tests cover:
- **Pricing:** Single items, multiple quantities, invalid SKUs, quantity validation, tax rounding rules.
- **Contact:** Validation schemas, email format checks, length limits, honeypot spam detection, sliding-window rate limiters.
- **Payments:** Razorpay HMAC-SHA256 signature verification, webhook signature verification, event idempotency, and non-downgrading state machine protection.

---

## 16. Production Build

```bash
# Build the client bundle with Vite
npm run build

# Start the full-stack server
npm run start
```

---

## 17. Deploying to Vercel

The repository is pre-configured with `vercel.json` and serverless API handlers in `/api`:

1. **Push to GitHub**:
   Ensure all changes are pushed to your repository (`https://github.com/Ashish2614/AShK_-Studios.git`).
2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and select **Import** next to your `AShK_-Studios` repository.
   - **Framework Preset**: Vercel will automatically detect **Vite**.
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
3. **Configure Environment Variables in Vercel Project Settings**:
   Add the following variables in **Settings > Environment Variables**:
   - `GMAIL_CLIENT_ID`: `your_oauth_client_id.apps.googleusercontent.com`
   - `GMAIL_CLIENT_SECRET`: `your_oauth_client_secret`
   - `GMAIL_REFRESH_TOKEN`: `your_oauth_refresh_token`
   - `GMAIL_USER_EMAIL`: `your_email@gmail.com`
   - `GMAIL_APP_PASSWORD`: `your_16_char_app_password`
   - `OWNER_EMAIL`: `your_email@gmail.com`
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
   - `STRIPE_SECRET_KEY`: Your Stripe Secret Key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe Webhook Signing Secret
4. **Deploy**:
   Click **Deploy**. Vercel will build the frontend assets into `dist/` and automatically route `/api/*` to the serverless function.

---

## 18. Production Environment Variables

Ensure all secrets are provided in your hosting provider's Environment Variables dashboard (never commit `.env`).

---

## 19. Security Checklist

- [x] All canonical product prices computed and enforced strictly on server.
- [x] Webhook signatures cryptographically validated using raw request body.
- [x] Webhook event IDs deduplicated to prevent double-fulfillment.
- [x] No payment card data or credentials ever touch our application server.
- [x] Hidden honeypot fields reject automated bot submissions on contact forms.
- [x] IP-based sliding-window rate limiting on public checkout and contact endpoints.
- [x] Row Level Security (RLS) enabled on Supabase database.
- [x] Orders verified via server check before confirming in UI.

---

## 20. Switching from Test Mode to Live Mode

When ready to accept real payments:
1. Complete KYC verification on Razorpay and activate your live account.
2. Complete business identity verification on Stripe.
3. Replace `rzp_test_...` and `sk_test_...` keys with live keys (`rzp_live_...` and `sk_live_...`).
4. Update webhook endpoints to your production HTTPS domain.
5. Verify a small ₹1 real test charge on UPI and card.

---

## 21. Known Limitations & Owner Configuration

- **Real Catalog & Photography:** The catalog currently contains curated homestay products (bedding, teak racks, brass keys, hampers). The owner can update `src/lib/pricing/catalog.ts` with custom products and photography.
- **Active Credentials:** Until live Razorpay, Stripe, and Resend credentials are added, the system safely falls back to test simulations with complete feedback loops.
