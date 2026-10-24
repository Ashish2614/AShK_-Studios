import { Product, PricingCalculationResult, OrderItem } from '../../types';

export const PRODUCTS: Product[] = [
  {
    id: 'ashk-bed-01',
    slug: 'estate-organic-cotton-bedding',
    title: 'Estate Organic Cotton Bedding Set',
    subtitle: '500 Thread Count Long-Staple Sateen Weave',
    description: 'Bespoke homestay linen crafted with certified long-staple Indian organic cotton. Naturally breathable, silky-soft, and tailored to endure frequent hospitality laundering with elegance.',
    category: 'bedding',
    pricePaise: 480000, // ₹4,800
    priceUsdCents: 5800, // $58.00
    inStock: true,
    requiresShipping: true,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      '100% GOTS-Certified Organic Indian Cotton',
      '500 Thread Count single-ply yarn for cloud-like softness',
      'Deep 16-inch mattress pockets for plush homestay mattresses',
      'Includes 1 Flat Sheet, 1 Fitted Sheet, and 2 Oxford Pillowcases'
    ],
    specifications: {
      'Material': '100% Organic Cotton Sateen',
      'Thread Count': '500 TC',
      'Origin': 'Coimbatore, Tamil Nadu',
      'Care': 'Machine wash cold, tumble dry low or sun dry'
    },
    leadTimeDays: 3
  },
  {
    id: 'ashk-furn-01',
    slug: 'plantation-teak-folding-luggage-rack',
    title: 'Plantation Teak Folding Luggage Rack',
    subtitle: 'Hand-carved with Full-Grain Saddle Leather Straps',
    description: 'Designed specifically for heritage estate guest suites. Crafted from solid seasoned plantation teak with reinforced brass pivots and heavy-duty vegetable-tanned leather straps to cradle guest baggage gracefully.',
    category: 'furniture',
    pricePaise: 650000, // ₹6,500
    priceUsdCents: 7800, // $78.00
    inStock: true,
    requiresShipping: true,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Sustainably harvested reclaimed Nilambur plantation teak',
      '3.5mm vegetable-tanned harness leather straps in cognac brown',
      'Folds flat in seconds for versatile suite storage',
      'Brass hardware with protective felt floor pads'
    ],
    specifications: {
      'Dimensions': '65cm W x 45cm D x 55cm H',
      'Weight Capacity': '75 kg',
      'Finish': 'Natural matte beeswax polish',
      'Origin': 'Channapatna Woodcraft Studio, Karnataka'
    },
    leadTimeDays: 4
  },
  {
    id: 'ashk-brass-01',
    slug: 'heritage-brass-room-keys-fobs',
    title: 'Heritage Cast Brass Room Keys & Fobs',
    subtitle: 'Set of 4 Solid Brass Keys with Custom Engraved Teak Fobs',
    description: 'Elevate your homestay arrival experience. Solid sand-cast brass keys paired with hand-turned teakwood tear-drop fobs, custom numbered or engraved with your estate cottage names.',
    category: 'brass-decor',
    pricePaise: 220000, // ₹2,200
    priceUsdCents: 2700, // $27.00
    inStock: true,
    requiresShipping: true,
    images: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Traditional Moradabad sand-casting technique',
      'Solid antique-patina brass with protective clear lacquer',
      'Laser-engraved teak fobs with complimentary custom cottage numbering',
      'Heavy, tactile heirloom handfeel (180g per key unit)'
    ],
    specifications: {
      'Weight': '720g (Set of 4)',
      'Key Length': '12.5 cm',
      'Fob Material': 'Reclaimed Indian Teak',
      'Origin': 'Moradabad, Uttar Pradesh'
    },
    leadTimeDays: 2
  },
  {
    id: 'ashk-tea-01',
    slug: 'single-estate-morning-hamper',
    title: 'Single-Estate Darjeeling Tea & Breakfast Hamper',
    subtitle: 'Artisanal Loose Leaf, Raw Forest Honey & Brass Strainer',
    description: 'Offer guests an unforgettable sunrise ritual. Features First-Flush Makaibari organic loose leaf tea, raw wild forest honey gathered in Coorg, and a hand-beaten brass tea strainer in a woven bamboo hamper.',
    category: 'gourmet-hampers',
    pricePaise: 195000, // ₹1,950
    priceUsdCents: 2400, // $24.00
    inStock: true,
    requiresShipping: true,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      '150g First-Flush Makaibari Organic Darjeeling Black Tea',
      '200g Raw Unfiltered Coorg Blossom Honey',
      'Hand-hammered brass tea strainer with fine mesh',
      'Packaged in an artisanal keepsake woven bamboo basket'
    ],
    specifications: {
      'Shelf Life': '18 Months',
      'Dietary': '100% Vegetarian & Organic',
      'Origin': 'Darjeeling (West Bengal) & Coorg (Karnataka)',
      'Basket Size': '28cm x 20cm x 12cm'
    },
    leadTimeDays: 2
  },
  {
    id: 'ashk-linen-02',
    slug: 'coorg-waffle-towel-robe-kit',
    title: 'Coorg Cotton Waffle Towel & Robe Kit',
    subtitle: 'Quick-Drying Honeycomb Weave in Natural Ivory',
    description: 'Designed for hill station and humid coastal homestays alike. Ultra-absorbent, fast-drying 100% natural unbleached cotton waffle bathrobe with 2 matching oversized bath sheets.',
    category: 'bedding',
    pricePaise: 340000, // ₹3,400
    priceUsdCents: 4200, // $42.00
    inStock: true,
    requiresShipping: true,
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Generous 380 GSM waffle knit for rapid air drying',
      'Pre-washed with organic enzymes for shrinkage resistance',
      'Kimono collar bathrobe with deep patch pockets',
      'Naturally antibacterial and hypoallergenic'
    ],
    specifications: {
      'Contains': '1 Bathrobe (Unisex One-Size) + 2 Bath Towels (75 x 150 cm)',
      'Color': 'Warm Sandstone Ivory',
      'Origin': 'Karur, Tamil Nadu',
      'Care': 'Machine wash cold, avoid bleach'
    },
    leadTimeDays: 3
  },
  {
    id: 'ashk-srv-01',
    slug: 'homestay-setup-audit-consulting',
    title: 'Homestay Host Advisory & Setup Audit',
    subtitle: 'Complete Operational & Design Blueprint for Property Owners',
    description: 'A 1-on-1 virtual comprehensive consultation with AShK Stays hospitality specialists. Covers interior guest layout optimization, revenue pricing strategy, guest amenities checklist, and vendor sourcing.',
    category: 'host-services',
    pricePaise: 1200000, // ₹12,000
    priceUsdCents: 14500, // $145.00
    inStock: true,
    requiresShipping: false,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      '90-Minute 1-on-1 Strategic Video Session with Senior Hospitality Architect',
      'Customized 24-Page Homestay Standard Operating Procedure (SOP) Manual',
      'Amenity & Linen Procurement Matrix with Direct Artisan Wholesale Rates',
      'OTA (Airbnb/Booking.com) Title, Photo & Description Optimization Review'
    ],
    specifications: {
      'Format': 'Virtual Video Session + Custom PDF Deliverables',
      'Lead Time': 'Scheduled within 4 business days of booking',
      'Post-Session Support': '30 Days Email Host Q&A Included',
      'Eligibility': 'Valid for homestays, heritage villas & farm retreats across India'
    },
    leadTimeDays: 0
  },
  {
    id: 'ashk-decor-02',
    slug: 'artisan-chai-kullad-pourer-collection',
    title: 'Artisan Ceramic Chai Kullad & Pourer Set',
    subtitle: 'Set of 6 Stoneware Cups with Matching Glazed Teapot',
    description: 'Reinvent the Indian roadside chai moment for your guests in stoneware luxury. Hand-thrown on traditional potter wheels in Khurja with a matte terracotta exterior and food-safe speckled ivory glazed interior.',
    category: 'brass-decor',
    pricePaise: 165000, // ₹1,650
    priceUsdCents: 2000, // $20.00
    inStock: true,
    requiresShipping: true,
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Hand-thrown high-fire stoneware clay',
      'Heat-retaining double wall feel with comfortable lip curve',
      'Lead-free, cadmium-free microwave and dishwasher safe glaze',
      '600ml pourer pot with integrated spout tea leaf filter'
    ],
    specifications: {
      'Capacity': 'Cups: 140ml each, Pourer: 600ml',
      'Finish': 'Raw Terracotta Matte & Cream Speckled Glaze',
      'Origin': 'Khurja Pottery Cluster, Uttar Pradesh',
      'Care': 'Dishwasher safe'
    },
    leadTimeDays: 3
  },
  {
    id: 'ashk-decor-03',
    slug: 'botanical-room-mist-diffuser-set',
    title: 'Botanical Room Mist & Diffuser Set',
    subtitle: 'Wild Himalayan Cedarwood, Sandalwood & Bergamot',
    description: 'The signature ambient scent of AShK Stays properties. Formulated with pure steam-distilled essential oils from Uttarakhand forests. Leaves guest rooms smelling naturally crisp, grounded, and welcoming.',
    category: 'gourmet-hampers',
    pricePaise: 145000, // ₹1,450
    priceUsdCents: 1800, // $18.00
    inStock: true,
    requiresShipping: true,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      '100ml Amber glass botanical room spray + 120ml Reed diffuser with 8 rattan reeds',
      '100% Pure therapeutic grade essential oils without artificial synthetic musks',
      'Signature scent profile: Himalayan Cedar, Mysore Sandalwood, Bergamot peel',
      'Provides 60+ days of continuous subtle fragrance diffusion'
    ],
    specifications: {
      'Volume': '100ml Spray + 120ml Diffuser',
      'Diffusion Time': '60-75 Days',
      'Ingredients': 'Alcohol Denat., Pure Essential Oil Blend, Aqua',
      'Origin': 'Dehradun, Uttarakhand'
    },
    leadTimeDays: 2
  }
];

export const PRODUCT_MAP = new Map<string, Product>(
  PRODUCTS.map(p => [p.id, p])
);

export const FREE_SHIPPING_THRESHOLD_PAISE = 250000; // Free shipping above ₹2,500
export const STANDARD_SHIPPING_PAISE = 25000; // ₹250 flat standard shipping
export const GST_RATE = 0.18; // 18% GST

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rupees);
}

export function formatUSD(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(dollars);
}

export interface RequestedItem {
  productId: string;
  quantity: number;
}

export function calculateOrderPricing(
  items: RequestedItem[],
  currency: 'INR' | 'USD' = 'INR'
): PricingCalculationResult {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  let subtotalPaise = 0;
  let subtotalUsdCents = 0;
  let requiresShipping = false;

  const orderItems: OrderItem[] = [];

  for (const item of items) {
    if (!item.productId || typeof item.productId !== 'string') {
      throw new Error('Invalid or missing product identifier');
    }

    const product = PRODUCT_MAP.get(item.productId);
    if (!product) {
      throw new Error(`Product not found with id: ${item.productId}`);
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      throw new Error(`Invalid quantity ${item.quantity} for product "${product.title}". Must be an integer between 1 and 20.`);
    }

    const lineTotalPaise = product.pricePaise * item.quantity;
    subtotalPaise += lineTotalPaise;
    subtotalUsdCents += product.priceUsdCents * item.quantity;

    if (product.requiresShipping) {
      requiresShipping = true;
    }

    orderItems.push({
      productId: product.id,
      productTitle: product.title,
      unitPricePaise: product.pricePaise,
      quantity: item.quantity,
      lineTotalPaise
    });
  }

  // Shipping calculation
  let shippingPaise = 0;
  if (requiresShipping) {
    shippingPaise = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : STANDARD_SHIPPING_PAISE;
  }

  // Tax calculation: 18% GST itemized on subtotal
  const taxPaise = Math.round(subtotalPaise * GST_RATE);
  const totalPaise = subtotalPaise + shippingPaise + taxPaise;

  // Stripe USD calculation (convert total proportionately with $5 shipping if applicable)
  const shippingUsdCents = requiresShipping ? (subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : 500) : 0;
  const taxUsdCents = Math.round(subtotalUsdCents * GST_RATE);
  const totalUsdCents = subtotalUsdCents + shippingUsdCents + taxUsdCents;

  return {
    items: orderItems,
    subtotalPaise,
    shippingPaise,
    taxPaise,
    totalPaise,
    formattedSubtotal: formatINR(subtotalPaise),
    formattedShipping: shippingPaise === 0 ? 'FREE' : formatINR(shippingPaise),
    formattedTax: formatINR(taxPaise),
    formattedTotal: formatINR(totalPaise),
    requiresShipping,
    totalUsdCents
  };
}
