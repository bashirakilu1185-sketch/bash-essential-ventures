# EL BASH SMART TECH HUB — audit, fixes and deployment report

Project: static storefront (`index.html` + `assets/`). No frameworks, no build step, no dependencies.
Design, layout, colours, typography, sections, carousels, product cards and footer are unchanged.

---

## 1. Verified test results (run against the exact files in this folder)

| Check | Tool / method | Result |
|---|---|---|
| HTML validity | W3C Nu validator (rendered DOM, `validator.w3.org/nu`) | **0 errors, 0 warnings** (was **42 errors + 10 info**) |
| JavaScript syntax | `node --check` on `main.js`, `products.js` | pass |
| Console errors | Chromium via Playwright, full page load | 0 |
| Uncaught page errors | Playwright `pageerror` | 0 |
| Failed network requests | Playwright request/response listeners | 0 (no 4xx/5xx) |
| Local asset references | every `src`/`href`/`srcset` in the rendered DOM requested and checked | all resolve |
| Image decoding | all 48 `<img>` elements force-loaded and decode-checked | 48/48 OK |
| Alt text + dimensions | DOM audit | 100% present |
| Duplicate IDs | DOM audit | none |
| Heading structure | DOM audit | one `<h1>`, no skipped levels |
| Search | typed queries + empty state + clear | works |
| Category filter chips | click each chip, grid re-renders | works |
| Sorting | price low→high order verified numerically, reset verified | works |
| Cart | add, badge, localStorage, survive reload | works |
| Quantity + / − and totals | click, value and subtotal re-read | works |
| Remove from cart | click, badge returns to 0 | works |
| Cart drawer | open/close, `aria-hidden` state | works |
| Horizontal carousels | `scrollLeft` before/after on all 3 rails | all scroll |
| Legal dialogs | open, close, Escape key | works |
| Mobile menu | toggle + `aria-expanded` | works |
| Responsive overflow | `scrollWidth` at 320, 360, 390, 414, 768, 1024, 1280, 1440, 1920 px | no horizontal overflow at any width |
| WhatsApp links | href inspection | `https://wa.me/2347080231185` (correct) |
| Email link | href inspection | `mailto:bashirakilu1185@gmail.com` (correct) |
| Address | visible page text | `Nigeria, Kano State, Bunkure, Kumurya.` |
| Secrets scan | regex scan of all source files | no keys, tokens, passwords |
| Standalone single-file build | opened over `file://`, images + cart tested | 48/48 images, 0 errors, cart works |

Repeatable harness: `/home/user/predeploy_check.py` (57 assertions, all passing).

---

## 2. Problems found and fixed

### HTML structure and accessibility
1. **Broken nested anchor in the email contact card** — `<a class="contact-card">` contained
   `<strong id="contactEmail"><a mailto:…></a></strong>`. HTML parsers split the outer anchor, which
   produced a duplicate `id="contactEmail"`, five validator errors and an unpredictable tap target on
   phones. The inner link was removed; the whole card is the mailto link, and the address is set as text.
2. **34 invalid `aria-label` attributes on plain `<div>`s** (product rating stars, category chips
   etc.). Rating blocks now use `role="img"`, which legitimises the label; other cases use roles that
   match their behaviour (`role="status"`, `role="group"`, `role="region"`).
3. **`aria-label` on `span#cartCount`** — now `role="status"` with `aria-live`, so screen readers
   announce "N items in cart" correctly.
4. **`<aside role="dialog" aria-modal="true">`** for the cart drawer — invalid role/element pairing.
   Changed to `<div role="dialog" aria-modal="true" aria-labelledby … aria-hidden inert>`, and the
   matching closing tag was corrected.
5. **9 redundant `role="button"`** on real `<button>` elements (category chips). Removed.
6. **`href="#"` legal links** in the footer → real `<button>` elements with keyboard focus styles.
7. Every image keeps its `alt`, `width` and `height`; the decorative ones stay `aria-hidden`.

### Branding and placeholder content
8. **Outdated brand name** in `assets/brand/logo.svg` and `assets/img/favicon.svg`
   (`aria-label="BASH Essential Ventures"`) → `EL BASH SMART TECH HUB`. Artwork untouched.
9. **Placeholder favicon from Cloudinary** replaced by a local `favicon.svg` + a generated
   `apple-touch-icon.png` (180×180). No external image host is referenced anywhere any more.
10. **Developer instructions visible to customers** removed:
    "Sample catalogue … editable sample data … add your real photos in assets/js/products.js",
    "Instagram — add link / Facebook — add link / TikTok — add link / X — add link",
    "Business email — to be added", "Shop address — to be added",
    "Template text — review and edit before publishing".
    Social rows now render only channels that exist (WhatsApp + email), and the footer prints the real
    email and address straight from the HTML (so they are also correct without JavaScript).
11. **Placeholder privacy policy** ("This is placeholder policy text … replace it before publishing")
    replaced with a real, accurate policy describing what the site actually does: a cart in
    `localStorage`, no accounts, no payment data, no analytics/advertising cookies, WhatsApp/email
    hand-off, and how a visitor clears their data. No certifications or guarantees were invented.
    The Terms section was left factually identical (it already described sample pricing and
    WhatsApp-only ordering) with the wording kept honest.
12. Sample/demo products keep their visible `SAMPLE – EDITABLE` badge, `sample price` note and the
    section note "Sample catalogue & sample prices — final prices are confirmed on WhatsApp", as
    required — these are labels, not developer instructions.

### SEO and metadata
13. **`<link rel="canonical" href="https://bashessentialventures.example/">`** — an invented
    `.example` domain — replaced with the only production address that exists:
    `https://endearing-concha-dddac7.netlify.app/`.
14. **`og:image` / `twitter:image`** pointed at a Cloudinary screenshot. A proper **1200×630
    `assets/img/og-image.jpg`** was generated from the hero product photograph, with
    `og:image:width/height/alt`, `og:url` and `og:locale`.
15. **JSON-LD** now carries the verified details only: name, description, phone, email, address
    (Bunkure, Kano State, NG), currency, areaServed, URL, logo and image. `sameAs` is deliberately
    absent because no official social profiles exist — nothing was invented.
16. Title, description, `theme-color`, `lang="en"`, `viewport-fit=cover` were already correct and
    were preserved.

### JavaScript and security
17. **Inline `onerror` handlers** on the hero and owner photos, plus the inline
    `<script>` image-resolver block in `<head>`, removed. The same logic now lives in `main.js`
    (`wireStaticImages()`), so the page has no inline event handlers and a CSP-friendly structure.
    Added the missing `.hero-card.is-fallback` style so the hero card keeps its shape if the
    photograph ever fails.
18. **`innerHTML` used for data→DOM insertion** in the contact block (email, footer email) replaced
    by `textContent` / `document.createElement`, removing the injection surface. Product, cart and
    chip templates still interpolate only through the existing `esc()` helper.
19. Footer social/email markup is built from `BUSINESS` only; no unescaped values reach the DOM.
20. All `target="_blank"` links keep `rel="noopener noreferrer"` (verified, 0 violations).
21. No third-party scripts, no external fonts/CDNs, no API keys or secrets anywhere in the project.

### Performance
22. **Font and hero preloads** added (`sora-var.woff2`, `inter-var.woff2`, hero WebP) — the two fonts
    are local woff2 files, so there is no FOUT-inducing network round trip to a font CDN.
23. The old Cloudinary favicon/social images are gone: one fewer origin to resolve, and the page now
    makes **zero third-party requests**.
24. Local images already ship as WebP with JPEG fallback through `<picture>`, with `width`/`height`,
    `loading="lazy"` below the fold and `fetchpriority="high"` + `decoding="async"` on the hero.
25. The single-file build no longer contains dead preload hints (build script updated).

### Delivery / deployability
26. `netlify.toml` added (publish `.`, no build command, cache + security headers), `.nojekyll` added
    for GitHub Pages, `.gitignore` excluding local-only material.
27. `standalone/el-bash-smart-tech-hub.html` rebuilt: one self-contained file (images and fonts
    inlined) that works by double-clicking with no server.

---

## 3. Things I deliberately did **not** change

* Layout, section order, header/nav, hero, banners, colours, typography, product cards, category
  carousels, footer, animations — untouched, as instructed.
* Prices, product names and imagery — untouched apart from the sample labelling already present.
  No real product facts were invented.
* WhatsApp number, email and address — never replaced.
* The 45% of `main.js` functions that are never called were **left in place**: they are
  self-contained helpers (icons, formatting, rail utilities) and removing them at this stage would
  add risk without a measurable user-facing benefit. They are documented here rather than silently
  deleted.
* `assets/img/*.jpg` are kept as the fallback layer for browsers without WebP; deleting them would
  break that fallback.

---

## 4. Remaining manual items (need your input, not code)

1. **Production URL.** Canonical / OG / JSON-LD point at `https://endearing-concha-dddac7.netlify.app/`.
   If the site will live on a custom domain or GitHub Pages, send the exact URL and it can be updated
   in one place per file.
2. **Real product data.** Replace sample entries (`sample: true` in `assets/js/products.js`) and the
   sample prices with real stock when available.
3. **Social profiles.** Add real URLs to `BUSINESS.socials`; the icons/links will appear automatically
   in both the contact card and the footer.
4. **Legal review.** The privacy/terms text now describes the site accurately, but a lawyer's review
   before publishing is still the sensible step for a business.
5. **Real-device check.** Tested in headless Chromium at 320–1920 px; a quick pass on a physical
   Android phone and iPhone is still worth doing for WhatsApp deep-link behaviour.
6. **Owner photograph.** `assets/img/owner.jpg` is a 567×1032 portrait; a sharper, larger original
   would improve the Retina rendering of that panel.

---

## 5. Note on the GitHub push

The repository was prepared (branch `main`, one commit, 74 files, `.gitignore`, `netlify.toml`,
`.nojekyll`) and the push was attempted, but it cannot complete from this environment: there is no
GitHub connection for the account here, so Git has no credentials to authenticate with.
The exact error was:

```
fatal: could not read Username for 'https://github.com': terminal prompts disabled
```

See `PUSH-TO-GITHUB.md` for the three ways to finish the upload — it is a two-command job with the
ZIP already in your hands.
