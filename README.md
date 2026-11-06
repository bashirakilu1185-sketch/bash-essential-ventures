# EL BASH SMART TECH HUB — storefront

Recovered from the live Netlify deployment
(<https://endearing-concha-dddac7.netlify.app>) on **30 October 2026**.

The live deployment was a single bundled HTML file (CSS, JS, fonts and every
image embedded as base64). The bundle has been unpacked back into normal,
editable project files — no design, layout, colour, copy or product was changed.
The recovered build is **pixel-identical** to the live site (verified at 1440px
and 390px; the only difference is Netlify's own "Powered by Netlify" badge,
which their CDN injects and is not part of the site).

## Project structure

```
index.html                     the page (markup only)
assets/
  css/styles.css               all styling — design tokens at the top
  js/products.js               BUSINESS details, CATEGORIES, PRODUCTS  ← edit here
  js/main.js                   cart, search, filters, sorting, modals, WhatsApp
  img/products/                20 product photos (.webp + .jpg), 8 of them
                               for the clearly-labelled sample products
  img/owner.jpg                owner photo (Contact section; falls back to the
                               Cloudinary URL if the local file is removed)
  img/categories/              8 category photos (.webp + .jpg)
  img/hero-showcase*.{webp,jpg} hero collage (plus small WebP variant)
  img/favicon.svg              favicon
  brand/logo.svg               brand mark (used by the Store schema)
  fonts/sora-var.woff2         headings font (Sora 300–800)
  fonts/inter-var.woff2        body font (Inter 300–700)
tools/build_standalone.py      rebuilds the single-file offline version
standalone/
  bash-essential-ventures.html the single-file build (opens with no server)
_original/
  netlify-deploy-original.html untouched copy downloaded from Netlify
  preview-desktop.png          full-page screenshot (1440px)
  preview-mobile.png           full-page screenshot (390px)
```

## Open it locally (from the ZIP)

Unzip the folder anywhere and **double-click `index.html`** — it runs straight
from your computer with no server and no internet. Keep the `assets` folder next
to `index.html`; every image, font and stylesheet is loaded from it with relative
paths, so the site works from any folder (or from a USB stick).

Want to host it instead? Upload the same folder to Netlify, GitHub Pages or any
cPanel `public_html` — no build step needed.

## Run it

The preview server runs from this folder:

```bash
cd bash-essential-ventures
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Any static host (Netlify, Vercel, GitHub
Pages, cPanel) will serve the folder as-is — drop it in and deploy, no build
step required.

To regenerate the offline single-file version after editing:

```bash
python3 tools/build_standalone.py            # -> standalone/bash-essential-ventures.html
```

## How to edit the shop

| What you want to change | Where |
| --- | --- |
| Business name, phone / WhatsApp, email, address, social links | `assets/js/products.js` → `BUSINESS` |
| Products (name, price, old price, badge, blurb, rating, category, photo) | `assets/js/products.js` → `PRODUCTS` |
| Categories and their taglines / photos | `assets/js/products.js` → `CATEGORIES` |
| Colours, spacing, typography, layout | `assets/css/styles.css` (tokens block at the top) |
| Headlines and body copy on the page | `index.html` |
| Product photos | replace files in `assets/img/products/` (keep `.webp` **and** `.jpg`, 760×760) |
| Owner photo | replace `assets/img/owner.jpg` (portrait works best, ~4:5 or taller) |
| Collection rails (which products appear, in what order) | `assets/js/main.js` → `RAILS` |

Prices are plain numbers in Naira, e.g. `price: 18500` renders as `₦18,500`.

## Features carried over intact

- Dark "premium tech" design with Sora/Inter type, gradient headline, glow orbs,
  marquee, and scroll-reveal animations.
- 12 products across 8 categories, each with WebP + JPEG `<picture>` markup and an
  automatic graceful fallback if an image is missing.
- Live search (header + mobile), category cards, filter chips with counts,
  sorting (featured / price / name), result counter, empty state and reset.
- Cart drawer with quantity +/−, remove, subtotal, saved in `localStorage`
  (`bash-cart-v1`), and a WhatsApp checkout message built from the cart.
- Per-product "Order on WhatsApp" links pre-filled with product name and price.
- Deals section, trust/"why us" grid, contact section, footer, legal modal
  (privacy / terms / returns), toasts, sticky header, mobile menu.
- Accessibility: skip link, ARIA dialog semantics, focus handling, `sr-only`
  labels, `noscript` notice.
- SEO: title/description, Open Graph + Twitter cards, `Store` JSON-LD.

## Still placeholders (unchanged from the live site)

These were deliberately left as placeholders in the original build — nothing was
invented during recovery:

- `BUSINESS.email`, `address` and the social URLs (Instagram / Facebook /
  TikTok / X) — footer and contact show "add link" / "Add shop address".
- `canonical` URL and the `og:image` / favicon still point at
  `bashessentialventures.example` and the Cloudinary screenshot from the original
  build.
- Product prices, ratings and review counts are the original sample/demo data.

## Update log — 30 October 2026

Requested changes, applied on top of the recovered design (nothing was removed or
redesigned):

1. **Owner card** added to the bottom of the Contact section, just above the
   footer: the owner's photo with the copy “This is the person to contact for
   product enquiries and orders.”, plus WhatsApp and email buttons and the
   address/phone. The photo is a local copy (`assets/img/owner.jpg`) so it also
   loads with no internet, and falls back to the original Cloudinary URL
   (`…/image/upload/f_auto,q_auto/owner`) if the local file is missing.
2. **Contact details filled in** — `bashirakilu1185@gmail.com` (clickable
   `mailto:` in the Contact section, the owner card and the footer) and
   `Nigeria, Kano State, Bunkure, Kumurya.` The WhatsApp button and every
   product's WhatsApp order link are unchanged.
3. **Horizontal carousels** — new “Shop the collections” section with three
   swipeable rails: **Watches**, **Bluetooth** (earbuds, speakers, audio
   receivers) and **Headphones**. Native touch swiping on Android/iOS, mouse
   drag-to-scroll on desktop, prev/next arrows, keyboard arrow-key support and
   scroll snapping. Cards keep their image, name, price, rating, Add button and
   WhatsApp shortcut. The existing filterable product grid is untouched, and the
   page never scrolls sideways.
4. **Rails are data-driven** — a rail shows however many products exist in its
   collection and only scrolls when they don't all fit on screen. Right now the
   catalogue holds 1 watch, 3 Bluetooth items and 2 headphones, so on a wide
   desktop all three rails fit without scrolling; on a phone the Bluetooth and
   Headphones rails scroll. Add more products in `assets/js/products.js` and the
   rails fill up and scroll automatically everywhere.

## Sample products — 30 October 2026

Eight sample products were added so every collection rail scrolls properly on
phones, tablets and desktop. They sit inside the normal catalogue, so they also
appear in the product grid, search, filters and sorting.

| Rail | Products after this update |
| --- | --- |
| Watches | 4 — Smartwatch + Aura Round / Pulse Sport / Heritage Leather |
| Bluetooth | 6 — Bluetooth Earbuds, Portable Bluetooth Speaker, Bluetooth Audio Receiver + Sport Earbuds / Mini Earbuds / Smart Speaker |
| Headphones | 4 — Wireless Headphones, Premium Wireless Headset + Studio Monitoring / Noise-Cancelling |

Every sample product is marked `sample: true` in `assets/js/products.js`, which
prints three labels on its card:

1. a **SAMPLE** badge on the photo,
2. a dashed **SAMPLE – EDITABLE** pill under the category,
3. a **sample price** note under the price.

### Replacing a sample with a real product

1. Open `assets/js/products.js` and find the entry (all IDs start with `sample-`).
2. Change `name`, `price`, `blurb`, `rating` and drop a new photo into
   `assets/img/products/` (760×760, save both `.webp` and `.jpg`), then update
   `image` to match.
3. Delete the `sample: true` line — all three sample labels disappear.
   (To remove a product entirely, delete its whole `{ … }` object.)
4. Rebuild the offline copy if you use it: `python3 tools/build_standalone.py`.

Prices, ratings and review counts on these eight items are sample values, in line
with the rest of the catalogue. Their photos come from Pexels, whose licence
allows free commercial use without attribution; swap them for your own product
photos whenever you're ready.

### Rails are still fully data-driven

A rail shows every product that matches its collection and only scrolls when the
cards don't fit on screen. Adding more products to a category automatically
populates and lengthens the matching rail — no code changes needed.
