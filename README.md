# BASH ESSENTIAL VENTURES — Premium Electronics E-Commerce Website

A premium, modern, fully responsive e-commerce website for **BASH ESSENTIAL VENTURES** — a Nigerian electronics store. Black · white · elegant gold branding, horizontal-scroll product shelves, live search, filters, a persistent shopping cart and one-tap WhatsApp ordering.

**Live ordering line (WhatsApp):** [+234 708 023 1185](https://wa.me/2347080231185)

---

## ✨ Features

| Area | Details |
| --- | --- |
| **Catalog** | 48 products across Mobile Phones (Samsung, iPhone, Infinix, Tecno, Xiaomi/Redmi, other Android), Audio & Bluetooth (headphones, earbuds, speakers, headsets, gaming), Smart Devices (smartwatches, fitness bands) and Accessories (chargers, cables, power banks, cases, screen protectors, wireless chargers, car accessories) |
| **Homepage** | Hero, brand marquee, category tiles, 14 horizontally-scrollable product shelves (Featured, Special Offers with countdown, per-brand phone shelves, audio, smart devices, accessories, Best Sellers), store showcase, Why Choose Us, WhatsApp band, professional footer |
| **Shopping** | Add to cart, quantity +/−, remove, subtotal & total, item-count badge, cart saved in `localStorage` |
| **WhatsApp ordering** | Cart + customer details (name, phone, address, note) compiled into a formatted order message and sent to `wa.me/2347080231185` |
| **Shop page** | Live search (debounced), category & sub-category filter, brand filter, on-sale toggle, 6 sort modes, shareable filter URLs (`shop.html?q=…&cat=…&brand=…&sort=…`) |
| **Mobile UX** | Swipeable category shelves (scroll-snap), bottom navigation bar, slide-in menu & cart drawers, no page-level horizontal scroll |
| **Branding** | Official Cloudinary logo & store images wired in with automatic local fallbacks; gold-on-black design system; Sora + Inter typography; reveal animations, reduced-motion support |

## 📁 Structure

```
index.html            Homepage
shop.html             Full catalog with search / filters / sorting
css/styles.css        Design system (black · white · gold)
js/products.js        Store config + 48-product catalog (edit prices/items here)
js/app.js             Rendering, cart, search, WhatsApp ordering
assets/img/           Hero, logo, store showcase
assets/img/products/  One image per product
tools/                Dev utilities (see below)
```

## 🖼 Product images

Each product has its own image at `assets/img/products/<id>.jpg`.

- Flagship phones currently use AI-generated studio photography (dark charcoal + gold lighting).
- Remaining items use generated on-brand line-art cards (`tools/make_placeholders.py`) sized and styled to match.
- To swap any product image, simply overwrite its file in `assets/img/products/` — no code changes needed.
- The two official Cloudinary images load from the URLs below and fall back to local copies (`assets/img/logo.png`, `assets/img/store-showcase.jpg`) if unreachable:
  - Logo — `https://res.cloudinary.com/ur6ymnwn/image/upload/f_auto,q_auto/1790974759984`
  - Store showcase — `https://res.cloudinary.com/ur6ymnwn/image/upload/f_auto,q_auto/Screenshot_20261024-123928`

## 🚀 Run & deploy

No build step — plain HTML/CSS/JS.

```bash
# local preview
python3 -m http.server 8080
# → http://localhost:8080
```

**GitHub Pages:** the site works straight from the repo root. In GitHub → Settings → Pages → Deploy from a branch → select the branch serving this code, folder `/ (root)`.

## 🛠 Dev tools

```bash
python3 tools/make_placeholders.py   # regenerate placeholder product art (needs Pillow)
node tools/smoketest.mjs             # 42-assertion end-to-end test (needs jsdom)
```

The smoke test covers: catalog integrity, homepage shelves, cart operations, localStorage persistence, WhatsApp message contents, search/filter/sort behaviour and empty states.

## ✏️ Common edits

- **Prices / products** → `js/products.js` (`price`, `oldPrice` for sale badges, `bestseller`, `featured`, `badge`)
- **WhatsApp number** → `js/products.js` → `STORE.whatsapp`
- **Brand colours** → `css/styles.css` → `:root`
