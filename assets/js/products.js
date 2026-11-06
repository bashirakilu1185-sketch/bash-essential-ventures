/* ==========================================================================
   EL BASH SMART TECH HUB — product & category data
   --------------------------------------------------------------------------
   Everything a shop owner needs to edit lives in this file.
   • Prices are SAMPLE prices (Naira, whole numbers). Edit freely.
   • `image` points to a local file in assets/img/products/.
     Replace a product photo by dropping a new file there and updating `image`.
   • `rating` is DEMO data and is labelled as such in the UI.
   • `oldPrice` is optional — only add it when a real previous price exists.
   ========================================================================== */

const BUSINESS = {
  name: 'EL BASH SMART TECH HUB',
  shortName: 'EL BASH',
  phoneDisplay: '+234 708 023 1185',
  phoneIntl: '2347080231185',
  whatsappBase: 'https://wa.me/2347080231185',
  /* ---- REAL BUSINESS DETAILS ---- */
  email: 'bashirakilu1185@gmail.com',
  address: 'Nigeria, Kano State, Bunkure, Kumurya.',
  socials: {
    instagram: '',      // e.g. 'https://instagram.com/yourhandle'
    facebook: '',
    tiktok: '',
    x: ''
  }
};

/* Eight categories, in the order they appear on the page. */
const CATEGORIES = [
  { id: 'headphones',  name: 'Headphones',        tagline: 'Immersive over-ear sound',    image: 'assets/img/categories/headphones.webp', icon: 'headphones' },
  { id: 'earbuds',     name: 'Wireless Earbuds',  tagline: 'Pocket-sized audio freedom',  image: 'assets/img/categories/earbuds.webp',    icon: 'earbuds' },
  { id: 'speakers',    name: 'Bluetooth Speakers',tagline: 'Room-filling wireless audio',  image: 'assets/img/categories/speaker.webp',    icon: 'speaker' },
  { id: 'smartwatch',  name: 'Smartwatches',      tagline: 'Health, calls and style',     image: 'assets/img/categories/smartwatch.webp', icon: 'watch' },
  { id: 'chargers',    name: 'Chargers & Adapters',tagline: 'Fast, safe everyday power',   image: 'assets/img/categories/chargerpad.webp', icon: 'bolt' },
  { id: 'powerbanks',  name: 'Power Banks',       tagline: 'Backup power that travels',   image: 'assets/img/categories/powerbank.webp',  icon: 'battery' },
  { id: 'phone',       name: 'Phone Accessories', tagline: 'Everyday phone upgrades',     image: 'assets/img/categories/mount.webp',      icon: 'phone' },
  { id: 'other',       name: 'Other Electronics', tagline: 'More smart tech essentials',  image: 'assets/img/categories/keyboard.webp',   icon: 'grid' }
];

const PRODUCTS = [
  {
    id: 'wireless-headphones',
    name: 'Wireless Headphones',
    category: 'headphones',
    price: 18500,
    image: 'assets/img/products/headphones.webp',
    imageAlt: 'Matte black over-ear wireless headphones with a glowing cyan earcup ring',
    blurb: 'Over-ear comfort with deep bass and long battery life.',
    badge: '',
    rating: 4.8,
    reviews: 42,
    featured: true
  },
  {
    id: 'bluetooth-earbuds',
    name: 'Bluetooth Earbuds',
    category: 'earbuds',
    price: 8500,
    image: 'assets/img/products/earbuds.webp',
    imageAlt: 'True wireless Bluetooth earbuds inside an open charging case with a battery display',
    blurb: 'True wireless earbuds with a pocket charging case.',
    badge: 'Sale',
    oldPrice: 9900,
    rating: 4.6,
    reviews: 36,
    featured: true
  },
  {
    id: 'portable-speaker',
    name: 'Portable Bluetooth Speaker',
    category: 'speakers',
    price: 15000,
    image: 'assets/img/products/speaker.webp',
    imageAlt: 'Cylindrical portable Bluetooth speaker with dark fabric mesh and a cyan light ring',
    blurb: 'Rugged portable speaker built for indoor and outdoor listening.',
    badge: '',
    rating: 4.7,
    reviews: 28,
    featured: true
  },
  {
    id: 'smartwatch',
    name: 'Smartwatch',
    category: 'smartwatch',
    price: 22000,
    image: 'assets/img/products/smartwatch.webp',
    imageAlt: 'Modern smartwatch with a bright display and dark silicone strap',
    blurb: 'Calls, notifications and activity tracking on your wrist.',
    badge: '',
    rating: 4.5,
    reviews: 31,
    featured: true
  },
  {
    id: 'fast-charging-adapter',
    name: 'Fast Charging Adapter',
    category: 'chargers',
    price: 6500,
    image: 'assets/img/products/charger.webp',
    imageAlt: 'Compact black fast charging wall adapter with USB-C ports',
    blurb: 'Compact multi-port adapter for phone, earbuds and accessories.',
    badge: '',
    rating: 4.4,
    reviews: 19,
    featured: false
  },
  {
    id: 'power-bank-20000',
    name: '20,000mAh Power Bank',
    category: 'powerbanks',
    price: 18000,
    image: 'assets/img/products/powerbank.webp',
    imageAlt: 'Slim 20,000mAh power bank with a digital battery percentage display',
    blurb: 'High-capacity backup battery with a digital charge display.',
    badge: 'Sale',
    oldPrice: 21000,
    rating: 4.7,
    reviews: 53,
    featured: true
  },
  {
    id: 'usb-charging-cable',
    name: 'USB Charging Cable',
    category: 'phone',
    price: 3000,
    image: 'assets/img/products/cable.webp',
    imageAlt: 'Braided USB-C charging cable coiled neatly with metal connectors',
    blurb: 'Braided, tangle-resistant charging cable for daily use.',
    badge: '',
    rating: 4.3,
    reviews: 24,
    featured: false
  },
  {
    id: 'premium-wireless-headset',
    name: 'Premium Wireless Headset',
    category: 'headphones',
    price: 25000,
    image: 'assets/img/products/headset.webp',
    imageAlt: 'Premium wireless headset with a boom microphone and cyan accent lighting',
    blurb: 'Headset with boom mic for calls, meetings and gaming.',
    badge: 'New',
    rating: 4.9,
    reviews: 17,
    featured: true
  },
  /* ---- Optional extra sample items (edit or remove freely) ---- */
  {
    id: 'mechanical-keyboard',
    name: 'Mechanical Wireless Keyboard',
    category: 'other',
    price: 27500,
    image: 'assets/img/products/keyboard.webp',
    imageAlt: 'Compact wireless mechanical keyboard with soft cyan backlighting',
    blurb: 'Compact wireless keyboard with tactile keys and backlighting.',
    badge: '',
    rating: 4.6,
    reviews: 12,
    featured: false
  },
  {
    id: 'wireless-charging-pad',
    name: 'Wireless Charging Pad',
    category: 'chargers',
    price: 9500,
    image: 'assets/img/products/chargerpad.webp',
    imageAlt: 'Slim circular wireless charging pad with a cyan light ring and coiled braided cable',
    blurb: 'Drop-and-go wireless charging pad for compatible phones.',
    badge: '',
    rating: 4.5,
    reviews: 14,
    featured: false
  },
  {
    id: 'bluetooth-audio-receiver',
    name: 'Bluetooth Audio Receiver',
    category: 'other',
    price: 12500,
    image: 'assets/img/products/receiver.webp',
    imageAlt: 'Compact Bluetooth audio receiver with a metal control knob and small antenna',
    blurb: 'Turn wired speakers and sound systems into wireless ones.',
    badge: 'New',
    rating: 4.4,
    reviews: 9,
    featured: false
  },
  {
    id: 'magnetic-phone-mount',
    name: 'Magnetic Phone Mount',
    category: 'phone',
    price: 4500,
    image: 'assets/img/products/mount.webp',
    imageAlt: 'Magnetic phone mount and grip accessories in matte black aluminium',
    blurb: 'Magnetic mount and grip set for desk, car or bedside.',
    badge: '',
    rating: 4.2,
    reviews: 15,
    featured: false
  },

  /* ==========================================================================
     SAMPLE PRODUCTS — added to fill the Watches / Bluetooth / Headphones rails.
     Every one is flagged `sample: true`, which prints a “SAMPLE – EDITABLE”
     label on the card and marks the price as a sample price.
     To sell a real product: replace the name, price, blurb and photo, then
     change `sample: true` to `sample: false` (or delete the whole entry).
     ========================================================================== */
  {
    id: 'sample-aura-round-watch',
    name: 'Aura Round Smartwatch',
    category: 'smartwatch',
    price: 29500,
    sample: true,
    image: 'assets/img/products/watch-round.webp',
    imageAlt: 'Round-face smartwatch with a black metal case and woven strap, held in a hand on a dark background',
    blurb: 'Round AMOLED display with call alerts and all-day activity tracking.',
    badge: 'Sample',
    rating: 4.6,
    reviews: 24,
    featured: false
  },
  {
    id: 'sample-pulse-sport-watch',
    name: 'Pulse Sport Smartwatch',
    category: 'smartwatch',
    price: 26500,
    sample: true,
    image: 'assets/img/products/watch-sport.webp',
    imageAlt: 'Square smartwatch with a black sport strap worn on the wrist',
    blurb: 'Rugged sport build with workout tracking and a week of battery life.',
    badge: 'Sample',
    rating: 4.4,
    reviews: 31,
    featured: false
  },
  {
    id: 'sample-heritage-leather-watch',
    name: 'Heritage Leather Watch',
    category: 'smartwatch',
    price: 31000,
    sample: true,
    image: 'assets/img/products/watch-classic.webp',
    imageAlt: 'Classic black dial watch on a black leather strap against a dark background',
    blurb: 'Classic black dial on a soft leather strap — dress it up or down.',
    badge: 'Sample',
    rating: 4.7,
    reviews: 18,
    featured: false
  },
  {
    id: 'sample-studio-monitor-headphones',
    name: 'Studio Monitoring Headphones',
    category: 'headphones',
    price: 34000,
    sample: true,
    image: 'assets/img/products/head-studio.webp',
    imageAlt: 'Studio monitoring headphones hanging beside a broadcast microphone',
    blurb: 'Closed-back monitoring headphones with balanced, detailed sound.',
    badge: 'Sample',
    rating: 4.8,
    reviews: 21,
    featured: false
  },
  {
    id: 'sample-noise-cancelling-headphones',
    name: 'Noise-Cancelling Headphones',
    category: 'headphones',
    price: 38500,
    sample: true,
    image: 'assets/img/products/head-anc.webp',
    imageAlt: 'Black over-ear headphones lit with violet and cyan rim light on a dark background',
    blurb: 'Active noise cancelling with cushioned over-ear comfort for long sessions.',
    badge: 'Sample',
    rating: 4.7,
    reviews: 27,
    featured: false
  },
  {
    id: 'sample-sport-earbuds',
    name: 'Sport Bluetooth Earbuds',
    category: 'earbuds',
    price: 13500,
    sample: true,
    image: 'assets/img/products/buds-sport.webp',
    imageAlt: 'Black true wireless earbuds inside an open charging case on a dark surface',
    blurb: 'Sweat-resistant earbuds with a pocket charging case.',
    badge: 'Sample',
    rating: 4.5,
    reviews: 33,
    featured: false
  },
  {
    id: 'sample-mini-earbuds',
    name: 'Mini Bluetooth Earbuds',
    category: 'earbuds',
    price: 9800,
    sample: true,
    image: 'assets/img/products/buds-mini.webp',
    imageAlt: 'Compact white wireless earbuds and charging case on a black surface',
    blurb: 'Featherweight earbuds that disappear in your pocket.',
    badge: 'Sample',
    rating: 4.3,
    reviews: 16,
    featured: false
  },
  {
    id: 'sample-smart-speaker',
    name: 'Smart Bluetooth Speaker',
    category: 'speakers',
    price: 27500,
    sample: true,
    image: 'assets/img/products/speaker-smart.webp',
    imageAlt: 'Fabric-covered smart speaker with a glowing blue light ring on a dark background',
    blurb: 'Room-filling 360° sound with a soft ambient light ring.',
    badge: 'Sample',
    rating: 4.6,
    reviews: 22,
    featured: false
  }
];
