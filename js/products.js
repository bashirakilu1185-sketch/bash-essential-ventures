/* ============================================================
   BASH ESSENTIAL VENTURES — Store configuration & catalog
   Premium electronics e-commerce
   ============================================================ */

const STORE = {
  name: 'BASH ESSENTIAL VENTURES',
  shortName: 'BASH Essential',
  tagline: 'Premium Electronics. Unbeatable Prices.',
  whatsapp: '2347080231185',
  phoneDisplay: '+234 708 023 1185',
  location: 'Abuja, Nigeria — Nationwide Delivery',
  hours: 'Mon – Sat · 8:00am – 7:00pm',
  /* Official business image (Cloudinary) + local fallback */
  logoUrl: 'https://res.cloudinary.com/ur6ymnwn/image/upload/f_auto,q_auto/1790974759984',
  logoFallback: 'assets/img/logo.png',
  /* Official electronics image (Cloudinary) + local fallback */
  showcaseUrl: 'https://res.cloudinary.com/ur6ymnwn/image/upload/f_auto,q_auto/Screenshot_20261024-123928',
  showcaseFallback: 'assets/img/store-showcase.png'
};

const CATEGORIES = [
  {
    id: 'phones', name: 'Mobile Phones', icon: '📱',
    blurb: 'Samsung · iPhone · Infinix · Tecno · Xiaomi & more',
    subs: [
      { id: 'samsung', name: 'Samsung Galaxy' },
      { id: 'apple',   name: 'Apple iPhone' },
      { id: 'infinix', name: 'Infinix' },
      { id: 'tecno',   name: 'Tecno' },
      { id: 'xiaomi',  name: 'Xiaomi & Redmi' },
      { id: 'other',   name: 'Other Android' }
    ]
  },
  {
    id: 'audio', name: 'Audio & Bluetooth', icon: '🎧',
    blurb: 'Headphones · Earbuds · Speakers · Headsets',
    subs: [
      { id: 'headphones', name: 'Bluetooth Headphones' },
      { id: 'earbuds',    name: 'Earbuds & AirPods' },
      { id: 'speakers',   name: 'Bluetooth Speakers' },
      { id: 'headsets',   name: 'Wireless Headsets' },
      { id: 'gaming',     name: 'Gaming Headsets' }
    ]
  },
  {
    id: 'smart', name: 'Smart Devices', icon: '⌚',
    blurb: 'Smartwatches · Bluetooth watches · Fitness bands',
    subs: [
      { id: 'watches', name: 'Smartwatches' },
      { id: 'bands',   name: 'Fitness Bands' }
    ]
  },
  {
    id: 'accessories', name: 'Phone Accessories', icon: '🔌',
    blurb: 'Chargers · Cables · Power banks · Cases & more',
    subs: [
      { id: 'chargers',   name: 'Chargers & Adapters' },
      { id: 'cables',     name: 'USB Cables' },
      { id: 'powerbanks', name: 'Power Banks' },
      { id: 'cases',      name: 'Phone Cases' },
      { id: 'protectors', name: 'Screen Protectors' },
      { id: 'wireless',   name: 'Wireless Chargers' },
      { id: 'car',        name: 'Car Accessories' }
    ]
  }
];

/* ------------------------------------------------------------
   PRODUCT CATALOG
   img paths are relative to the site root.
   ------------------------------------------------------------ */
const PRODUCTS = [
  /* ---------- SAMSUNG ---------- */
  {
    id: 'samsung-galaxy-s24-ultra', name: 'Samsung Galaxy S24 Ultra 5G (256GB)',
    brand: 'Samsung', cat: 'phones', sub: 'samsung',
    price: 1549000, oldPrice: 1699000, rating: 4.9, reviews: 148,
    desc: 'Titanium flagship with 200MP camera, built-in S Pen and Galaxy AI.',
    badge: 'Flagship', featured: true, bestseller: true,
    img: 'assets/img/products/samsung-galaxy-s24-ultra.jpg'
  },
  {
    id: 'samsung-galaxy-s24', name: 'Samsung Galaxy S24 5G (128GB)',
    brand: 'Samsung', cat: 'phones', sub: 'samsung',
    price: 899000, rating: 4.8, reviews: 86,
    desc: 'Compact flagship with bright AMOLED display and Galaxy AI smarts.',
    featured: false,
    img: 'assets/img/products/samsung-galaxy-s24.jpg'
  },
  {
    id: 'samsung-galaxy-a55', name: 'Samsung Galaxy A55 5G (128GB)',
    brand: 'Samsung', cat: 'phones', sub: 'samsung',
    price: 489000, oldPrice: 545000, rating: 4.7, reviews: 64,
    desc: 'Gorilla Glass body, 50MP OIS camera and smooth 120Hz screen.',
    featured: true,
    img: 'assets/img/products/samsung-galaxy-a55.jpg'
  },
  {
    id: 'samsung-galaxy-a15', name: 'Samsung Galaxy A15 (128GB)',
    brand: 'Samsung', cat: 'phones', sub: 'samsung',
    price: 238000, rating: 4.5, reviews: 52,
    desc: 'Big Super AMOLED screen, 50MP camera and 5000mAh battery.',
    img: 'assets/img/products/samsung-galaxy-a15.jpg'
  },

  /* ---------- APPLE IPHONE ---------- */
  {
    id: 'iphone-15-pro-max', name: 'Apple iPhone 15 Pro Max (256GB)',
    brand: 'Apple', cat: 'phones', sub: 'apple',
    price: 1749000, oldPrice: 1899000, rating: 5.0, reviews: 132,
    desc: 'Titanium body, A17 Pro chip and 48MP main camera with USB-C.',
    badge: 'Premium', featured: true, bestseller: true,
    img: 'assets/img/products/iphone-15-pro-max.jpg'
  },
  {
    id: 'iphone-15', name: 'Apple iPhone 15 (128GB)',
    brand: 'Apple', cat: 'phones', sub: 'apple',
    price: 1095000, rating: 4.9, reviews: 97,
    desc: 'Dynamic Island, 48MP camera and the reliable A16 Bionic chip.',
    img: 'assets/img/products/iphone-15.jpg'
  },
  {
    id: 'iphone-13', name: 'Apple iPhone 13 (128GB)',
    brand: 'Apple', cat: 'phones', sub: 'apple',
    price: 715000, oldPrice: 790000, rating: 4.8, reviews: 118,
    desc: 'Still a star — A15 chip, dual cameras and all-day battery.',
    img: 'assets/img/products/iphone-13.jpg'
  },
  {
    id: 'iphone-11', name: 'Apple iPhone 11 (64GB)',
    brand: 'Apple', cat: 'phones', sub: 'apple',
    price: 398000, rating: 4.6, reviews: 75,
    desc: 'Budget-friendly iPhone with dual camera and rock-solid performance.',
    img: 'assets/img/products/iphone-11.jpg'
  },

  /* ---------- INFINIX ---------- */
  {
    id: 'infinix-note-40-pro', name: 'Infinix Note 40 Pro (256GB)',
    brand: 'Infinix', cat: 'phones', sub: 'infinix',
    price: 339000, oldPrice: 379000, rating: 4.7, reviews: 58,
    desc: '108MP camera, 120Hz AMOLED and 70W fast charging with wireless pad.',
    badge: 'Hot', featured: true,
    img: 'assets/img/products/infinix-note-40-pro.jpg'
  },
  {
    id: 'infinix-hot-40i', name: 'Infinix Hot 40i (128GB)',
    brand: 'Infinix', cat: 'phones', sub: 'infinix',
    price: 132000, rating: 4.6, reviews: 143,
    desc: '90Hz display, 50MP camera and a massive 5000mAh battery.',
    bestseller: true,
    img: 'assets/img/products/infinix-hot-40i.jpg'
  },
  {
    id: 'infinix-smart-8', name: 'Infinix Smart 8 (64GB)',
    brand: 'Infinix', cat: 'phones', sub: 'infinix',
    price: 109000, rating: 4.4, reviews: 47,
    desc: 'Affordable everyday Android with big screen and dual speakers.',
    img: 'assets/img/products/infinix-smart-8.jpg'
  },

  /* ---------- TECNO ---------- */
  {
    id: 'tecno-camon-30', name: 'Tecno Camon 30 (256GB)',
    brand: 'Tecno', cat: 'phones', sub: 'tecno',
    price: 289000, rating: 4.7, reviews: 61,
    desc: 'Camera-focused phone with 50MP Sony sensor and 70W flash charge.',
    featured: true,
    img: 'assets/img/products/tecno-camon-30.jpg'
  },
  {
    id: 'tecno-spark-20-pro', name: 'Tecno Spark 20 Pro (128GB)',
    brand: 'Tecno', cat: 'phones', sub: 'tecno',
    price: 168000, oldPrice: 189000, rating: 4.6, reviews: 89,
    desc: '108MP camera, 120Hz display and premium glass design.',
    img: 'assets/img/products/tecno-spark-20-pro.jpg'
  },
  {
    id: 'tecno-pop-8', name: 'Tecno Pop 8 (64GB)',
    brand: 'Tecno', cat: 'phones', sub: 'tecno',
    price: 89000, rating: 4.3, reviews: 38,
    desc: 'Entry-level champion with 90Hz screen and 5000mAh battery.',
    img: 'assets/img/products/tecno-pop-8.jpg'
  },

  /* ---------- XIAOMI / REDMI / POCO ---------- */
  {
    id: 'redmi-note-13-pro', name: 'Redmi Note 13 Pro (256GB)',
    brand: 'Xiaomi', cat: 'phones', sub: 'xiaomi',
    price: 365000, oldPrice: 405000, rating: 4.8, reviews: 104,
    desc: '200MP camera, 120Hz AMOLED and 67W turbo charging.',
    featured: true, bestseller: true,
    img: 'assets/img/products/redmi-note-13-pro.jpg'
  },
  {
    id: 'redmi-13c', name: 'Redmi 13C (128GB)',
    brand: 'Xiaomi', cat: 'phones', sub: 'xiaomi',
    price: 149000, rating: 4.5, reviews: 72,
    desc: 'Big 6.74" display, 50MP camera and dependable battery life.',
    img: 'assets/img/products/redmi-13c.jpg'
  },
  {
    id: 'poco-x6-pro', name: 'POCO X6 Pro (256GB)',
    brand: 'Xiaomi', cat: 'phones', sub: 'xiaomi',
    price: 445000, rating: 4.7, reviews: 44,
    desc: 'Dimensity 8300 powerhouse built for gaming at 120Hz.',
    badge: 'New',
    img: 'assets/img/products/poco-x6-pro.jpg'
  },

  /* ---------- OTHER ANDROID ---------- */
  {
    id: 'google-pixel-8a', name: 'Google Pixel 8a (128GB)',
    brand: 'Google', cat: 'phones', sub: 'other',
    price: 625000, rating: 4.8, reviews: 29,
    desc: 'Pure Android with class-leading AI camera and 7 years of updates.',
    img: 'assets/img/products/google-pixel-8a.jpg'
  },
  {
    id: 'itel-s23', name: 'itel S23 (128GB)',
    brand: 'itel', cat: 'phones', sub: 'other',
    price: 86000, rating: 4.2, reviews: 41,
    desc: 'Super wallet-friendly Android with 50MP camera and 5000mAh.',
    img: 'assets/img/products/itel-s23.jpg'
  },

  /* ---------- HEADPHONES ---------- */
  {
    id: 'sony-wh-1000xm5', name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony', cat: 'audio', sub: 'headphones',
    price: 372000, oldPrice: 410000, rating: 5.0, reviews: 88,
    desc: 'Industry-leading noise cancelling with 30-hour battery life.',
    badge: 'Best Seller', bestseller: true,
    img: 'assets/img/products/sony-wh-1000xm5.jpg'
  },
  {
    id: 'jbl-tune-770nc', name: 'JBL Tune 770NC Wireless Headphones',
    brand: 'JBL', cat: 'audio', sub: 'headphones',
    price: 118000, rating: 4.6, reviews: 57,
    desc: 'Adaptive noise cancelling with JBL Pure Bass sound.',
    img: 'assets/img/products/jbl-tune-770nc.jpg'
  },
  {
    id: 'oraimo-boompop-2', name: 'Oraimo BoomPop 2 Wireless Headphones',
    brand: 'Oraimo', cat: 'audio', sub: 'headphones',
    price: 36500, rating: 4.4, reviews: 112,
    desc: 'Big bass, 60-hour playtime and comfortable over-ear fit.',
    img: 'assets/img/products/oraimo-boompop-2.jpg'
  },

  /* ---------- EARBUDS ---------- */
  {
    id: 'airpods-pro-2', name: 'Apple AirPods Pro (2nd Gen, USB-C)',
    brand: 'Apple', cat: 'audio', sub: 'earbuds',
    price: 209000, oldPrice: 235000, rating: 4.9, reviews: 126,
    desc: 'Active noise cancellation, adaptive audio and mag-safe case.',
    bestseller: true,
    img: 'assets/img/products/airpods-pro-2.jpg'
  },
  {
    id: 'galaxy-buds2-pro', name: 'Samsung Galaxy Buds2 Pro',
    brand: 'Samsung', cat: 'audio', sub: 'earbuds',
    price: 148000, rating: 4.7, reviews: 63,
    desc: 'Studio-quality 24-bit audio with intelligent ANC.',
    img: 'assets/img/products/galaxy-buds2-pro.jpg'
  },
  {
    id: 'oraimo-freepods-4', name: 'Oraimo FreePods 4 Earbuds',
    brand: 'Oraimo', cat: 'audio', sub: 'earbuds',
    price: 24500, rating: 4.5, reviews: 204,
    desc: 'ANC earbuds with 40-hour total playtime and fast charge.',
    bestseller: true,
    img: 'assets/img/products/oraimo-freepods-4.jpg'
  },
  {
    id: 'anker-soundcore-p20i', name: 'Anker Soundcore P20i Earbuds',
    brand: 'Anker', cat: 'audio', sub: 'earbuds',
    price: 31000, rating: 4.6, reviews: 91,
    desc: 'Big sound, AI-enhanced calls and 30-hour battery life.',
    img: 'assets/img/products/anker-soundcore-p20i.jpg'
  },

  /* ---------- WIRELESS HEADSETS ---------- */
  {
    id: 'bluetooth-single-ear-headset', name: 'Hoco Single-Ear Bluetooth Headset',
    brand: 'Hoco', cat: 'audio', sub: 'headsets',
    price: 16500, rating: 4.3, reviews: 36,
    desc: 'Lightweight hands-free headset, perfect for calls and driving.',
    img: 'assets/img/products/bluetooth-single-ear-headset.jpg'
  },

  /* ---------- SPEAKERS ---------- */
  {
    id: 'jbl-flip-6', name: 'JBL Flip 6 Portable Speaker',
    brand: 'JBL', cat: 'audio', sub: 'speakers',
    price: 128000, rating: 4.8, reviews: 77,
    desc: 'Powerful JBL Pro sound, waterproof and 12 hours of playtime.',
    bestseller: true,
    img: 'assets/img/products/jbl-flip-6.jpg'
  },
  {
    id: 'jbl-charge-5', name: 'JBL Charge 5 Bluetooth Speaker',
    brand: 'JBL', cat: 'audio', sub: 'speakers',
    price: 222000, oldPrice: 249000, rating: 4.9, reviews: 66,
    desc: 'Bold sound with powerbank feature to charge your phone.',
    img: 'assets/img/products/jbl-charge-5.jpg'
  },
  {
    id: 'oraimo-boom-2', name: 'Oraimo Boom 2 Portable Speaker',
    brand: 'Oraimo', cat: 'audio', sub: 'speakers',
    price: 26500, rating: 4.4, reviews: 84,
    desc: 'Punchy bass in a pocket size — IPX6 splash-proof body.',
    img: 'assets/img/products/oraimo-boom-2.jpg'
  },

  /* ---------- GAMING HEADSETS ---------- */
  {
    id: 'rgb-gaming-headset', name: 'Redragon Zeus RGB Gaming Headset',
    brand: 'Redragon', cat: 'audio', sub: 'gaming',
    price: 34500, rating: 4.5, reviews: 49,
    desc: '7.1 surround sound, noise-cancelling boom mic and RGB lighting.',
    badge: 'Gamer Pick',
    img: 'assets/img/products/rgb-gaming-headset.jpg'
  },

  /* ---------- SMARTWATCHES ---------- */
  {
    id: 'apple-watch-series-9', name: 'Apple Watch Series 9 (45mm)',
    brand: 'Apple', cat: 'smart', sub: 'watches',
    price: 498000, oldPrice: 560000, rating: 4.9, reviews: 71,
    desc: 'Brighter display, double-tap gesture and advanced health tracking.',
    bestseller: true,
    img: 'assets/img/products/apple-watch-series-9.jpg'
  },
  {
    id: 'galaxy-watch-6', name: 'Samsung Galaxy Watch 6 (44mm)',
    brand: 'Samsung', cat: 'smart', sub: 'watches',
    price: 365000, rating: 4.7, reviews: 45,
    desc: 'Sleep coaching, body composition and big AMOLED screen.',
    img: 'assets/img/products/galaxy-watch-6.jpg'
  },
  {
    id: 'smart-bluetooth-watch', name: 'Hoco Smart Watch (AMOLED, BT Calling)',
    brand: 'Hoco', cat: 'smart', sub: 'watches',
    price: 28500, rating: 4.4, reviews: 158,
    desc: 'Make calls from your wrist — AMOLED display with 100+ watch faces.',
    bestseller: true,
    img: 'assets/img/products/smart-bluetooth-watch.jpg'
  },
  {
    id: 'kids-gps-smart-watch', name: 'Kids GPS Smart Watch',
    brand: 'Hoco', cat: 'smart', sub: 'watches',
    price: 52000, rating: 4.5, reviews: 33,
    desc: 'Keep tabs on the little ones — GPS tracking, calls and class mode.',
    badge: 'Family',
    img: 'assets/img/products/kids-gps-smart-watch.jpg'
  },

  /* ---------- FITNESS BANDS ---------- */
  {
    id: 'xiaomi-smart-band-8', name: 'Xiaomi Smart Band 8',
    brand: 'Xiaomi', cat: 'smart', sub: 'bands',
    price: 42000, oldPrice: 49000, rating: 4.7, reviews: 96,
    desc: '16-day battery, 150+ sport modes and sleep tracking.',
    img: 'assets/img/products/xiaomi-smart-band-8.jpg'
  },

  /* ---------- CHARGERS ---------- */
  {
    id: 'oraimo-33w-charger', name: 'Oraimo 33W Super Fast Charger',
    brand: 'Oraimo', cat: 'accessories', sub: 'chargers',
    price: 11500, rating: 4.6, reviews: 187,
    desc: 'Charge to 50% in 25 minutes with a bundled Type-C cable.',
    img: 'assets/img/products/oraimo-33w-charger.jpg'
  },
  {
    id: 'samsung-25w-charger', name: 'Samsung 25W Adaptive Fast Charger',
    brand: 'Samsung', cat: 'accessories', sub: 'chargers',
    price: 13500, rating: 4.7, reviews: 122,
    desc: 'Original Samsung adaptive charging for Galaxy phones.',
    img: 'assets/img/products/samsung-25w-charger.jpg'
  },

  /* ---------- CABLES ---------- */
  {
    id: 'usbc-fast-cable', name: 'Baseus 60W USB-C Fast Charging Cable',
    brand: 'Baseus', cat: 'accessories', sub: 'cables',
    price: 5500, rating: 4.7, reviews: 210,
    desc: 'Braided, tangle-free 60W cable that survives daily abuse.',
    img: 'assets/img/products/usbc-fast-cable.jpg'
  },
  {
    id: 'lightning-cable', name: 'Apple Lightning Cable (MFi)',
    brand: 'Apple', cat: 'accessories', sub: 'cables',
    price: 6500, rating: 4.6, reviews: 98,
    desc: 'Certified MFi cable — safe, fast charging for iPhones.',
    img: 'assets/img/products/lightning-cable.jpg'
  },

  /* ---------- POWER BANKS ---------- */
  {
    id: 'oraimo-20000mah-power-bank', name: 'Oraimo 20000mAh Power Bank (22.5W)',
    brand: 'Oraimo', cat: 'accessories', sub: 'powerbanks',
    price: 26500, oldPrice: 31000, rating: 4.8, reviews: 233,
    desc: 'Charge your phone 4–5 times — 22.5W two-way fast charging.',
    bestseller: true,
    img: 'assets/img/products/oraimo-20000mah-power-bank.jpg'
  },
  {
    id: 'slim-10000mah-power-bank', name: 'Anker PowerCore 10000 Slim',
    brand: 'Anker', cat: 'accessories', sub: 'powerbanks',
    price: 34000, rating: 4.7, reviews: 76,
    desc: 'Pocket-size 10000mAh with Anker reliability. Charges 2 phones.',
    img: 'assets/img/products/slim-10000mah-power-bank.jpg'
  },

  /* ---------- CASES ---------- */
  {
    id: 'armor-phone-case', name: 'Spigen Rugged Armor Case (Android)',
    brand: 'Spigen', cat: 'accessories', sub: 'cases',
    price: 12500, rating: 4.8, reviews: 154,
    desc: 'Air-cushion corner protection with a sleek carbon-fibre look.',
    img: 'assets/img/products/armor-phone-case.jpg'
  },
  {
    id: 'clear-case-iphone', name: 'Spigen Ultra Hybrid Case (iPhone)',
    brand: 'Spigen', cat: 'accessories', sub: 'cases',
    price: 11500, rating: 4.7, reviews: 118,
    desc: 'Crystal-clear protection that shows off your iPhone.',
    img: 'assets/img/products/clear-case-iphone.jpg'
  },

  /* ---------- SCREEN PROTECTORS ---------- */
  {
    id: 'tempered-glass-protector', name: 'Nillkin Tempered Glass Protector',
    brand: 'Nillkin', cat: 'accessories', sub: 'protectors',
    price: 4500, rating: 4.6, reviews: 176,
    desc: '9H hardness, full-cover glass with easy install kit.',
    img: 'assets/img/products/tempered-glass-protector.jpg'
  },

  /* ---------- WIRELESS CHARGERS ---------- */
  {
    id: 'wireless-charging-pad', name: 'Anker 15W Wireless Charging Pad',
    brand: 'Anker', cat: 'accessories', sub: 'wireless',
    price: 18500, rating: 4.6, reviews: 64,
    desc: 'Drop, charge, done — 15W fast wireless charging with case support.',
    img: 'assets/img/products/wireless-charging-pad.jpg'
  },

  /* ---------- CAR ACCESSORIES ---------- */
  {
    id: 'dual-port-car-charger', name: 'Baseus 45W Dual-Port Car Charger',
    brand: 'Baseus', cat: 'accessories', sub: 'car',
    price: 9500, rating: 4.7, reviews: 102,
    desc: 'Two fast ports — charge driver and passenger at full speed.',
    img: 'assets/img/products/dual-port-car-charger.jpg'
  },
  {
    id: 'magnetic-car-mount', name: 'Baseus Magnetic Car Phone Mount',
    brand: 'Baseus', cat: 'accessories', sub: 'car',
    price: 8000, rating: 4.5, reviews: 87,
    desc: 'Strong magnetic grip with 360° rotation for safe driving.',
    img: 'assets/img/products/magnetic-car-mount.jpg'
  }
];

/* Utility lookups */
const CAT_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const SUB_NAME = {};
CATEGORIES.forEach(c => c.subs.forEach(s => { SUB_NAME[c.id + '/' + s.id] = s.name; }));
const BRANDS = [...new Set(PRODUCTS.map(p => p.brand))].sort((a, b) => a.localeCompare(b));
