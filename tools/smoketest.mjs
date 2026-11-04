/* Smoke test: renders both pages in jsdom and verifies shelves, cards,
   cart behaviour and WhatsApp ordering end-to-end.
   Run: node tools/smoketest.mjs  (requires jsdom installed next to this file) */
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const productsSrc = read('js/products.js');
const appSrc = read('js/app.js');

let pass = 0, fail = 0;
const ok = (cond, label) => {
  if (cond) { pass++; console.log('  ✓ ' + label); }
  else { fail++; console.log('  ✗ FAIL: ' + label); }
};

function boot(file, url) {
  const dom = new JSDOM(read(file), {
    url: url || ('https://bev.test/' + file),
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });
  const w = dom.window;
  const inject = src => {
    const s = w.document.createElement('script');
    s.textContent = src;
    w.document.body.appendChild(s);
  };
  inject(productsSrc);
  inject(appSrc);
  /* app listens with {once:true}, so this cannot double-boot when jsdom
     also fires its own DOMContentLoaded later */
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  return dom;
}

/* ---------- data integrity ---------- */
console.log('\n[1] Catalog data integrity');
{
  const dom = boot('index.html');
  const w = dom.window;
  const P = w.eval('PRODUCTS');
  const ids = new Set(P.map(p => p.id));
  ok(P.length === 48, `48 products in catalog (got ${P.length})`);
  ok(ids.size === P.length, 'product ids unique');
  const imgs = new Set();
  let missing = [], dupeImgs = [];
  P.forEach(p => {
    if (imgs.has(p.img)) dupeImgs.push(p.img);
    imgs.add(p.img);
    if (!fs.existsSync(path.join(ROOT, p.img))) missing.push(p.img);
  });
  ok(missing.length === 0, `every product image exists on disk ${missing.length ? '— missing: ' + missing : ''}`);
  ok(dupeImgs.length === 0, `no image used twice ${dupeImgs.length ? dupeImgs : ''}`);
  const prices = new Set(P.map(p => p.price));
  ok(prices.size > 40, 'prices are varied, not all identical');
  ok(P.every(p => p.price > 0 && p.name && p.desc && p.brand && p.img), 'every product has name/brand/desc/price/img');
  const cats = new Set(P.map(p => p.cat));
  ok([...cats].sort().join() === 'accessories,audio,phones,smart', 'all 4 top categories in use');
  ok(P.every(p => p.cat === 'phones' || p.cat === 'audio' || p.cat === 'smart' || p.cat === 'accessories'), 'valid categories');
}

/* ---------- homepage ---------- */
console.log('\n[2] Homepage rendering');
{
  const dom = boot('index.html');
  const d = dom.window.document;
  const shelves = d.querySelectorAll('.shelf');
  ok(shelves.length === 14, `14 shelves rendered (got ${shelves.length})`);
  const cards = d.querySelectorAll('.card');
  ok(cards.length === 78, `78 product cards across shelves (got ${cards.length})`);
  ok(d.querySelectorAll('#catGrid .cat-tile').length === 4, '4 category tiles');
  ok(!!d.querySelector('#dealCountdown'), 'deal countdown present');
  const emptyShelf = [...shelves].find(s => s.querySelectorAll('.card').length === 0);
  ok(!emptyShelf, 'no shelf is empty');
  const addBtns = d.querySelectorAll('[data-add]');
  ok(addBtns.length === cards.length, 'every card has an add-to-cart button');
  const firstImg = d.querySelector('.card img');
  ok(firstImg && firstImg.getAttribute('loading') === 'lazy', 'product images lazy-loaded');
  ok(!!d.querySelector('.hero img[src="assets/img/hero.jpg"]'), 'hero image present');
  const cloudinary = d.querySelectorAll('img[src*="res.cloudinary.com/ur6ymnwn"]');
  ok(cloudinary.length === 4, `official Cloudinary images used (logo x3 + showcase) — got ${cloudinary.length}`);
  ok(d.querySelectorAll('img[data-fallback]').length === 4, 'Cloudinary images have local fallbacks');
}

/* ---------- cart behaviour ---------- */
console.log('\n[3] Cart + WhatsApp ordering');
{
  const dom = boot('index.html');
  const w = dom.window, d = w.document;
  d.querySelector('[data-add="samsung-galaxy-s24-ultra"]').click();
  d.querySelector('[data-add="oraimo-freepods-4"]').click();
  let badge = d.querySelector('.cart-btn .cart-badge');
  ok(badge.textContent === '2' && badge.dataset.empty === '0', `cart badge shows 2 (got ${badge.textContent})`);
  let stored = JSON.parse(w.localStorage.getItem('bev_cart_v1'));
  ok(stored['samsung-galaxy-s24-ultra'] === 1 && stored['oraimo-freepods-4'] === 1, 'cart persisted to localStorage');

  w.BEV.openCart();
  ok(d.getElementById('cartDrawer').classList.contains('open'), 'cart drawer opens');
  ok(d.querySelectorAll('#cartItems .cart-item').length === 2, '2 items rendered in drawer');
  const sub = d.getElementById('cartSubtotal').textContent.replace(/[₦,]/g, '');
  ok(Number(sub) === 1549000 + 24500, `subtotal correct (got ${sub})`);

  d.querySelector('#cartItems [data-qty="1"]').click();
  stored = JSON.parse(w.localStorage.getItem('bev_cart_v1'));
  ok(stored['samsung-galaxy-s24-ultra'] === 2, 'quantity increase works and persists');
  d.querySelector('#cartItems [data-qty="-1"]').click();
  d.querySelector('#cartItems [data-qty="-1"]').click();
  stored = JSON.parse(w.localStorage.getItem('bev_cart_v1'));
  ok(!('samsung-galaxy-s24-ultra' in stored), 'quantity decrease to zero removes item');

  /* re-add and order via WhatsApp */
  d.querySelector('[data-add="iphone-15-pro-max"]').click();
  let opened = null;
  w.open = url => { opened = url; };
  d.getElementById('coName').value = 'Musa Test';
  d.getElementById('coPhone').value = '08031234567';
  d.getElementById('coAddress').value = '12 Test Street, Wuse, Abuja';
  d.getElementById('waOrderForm').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  ok(opened && opened.startsWith('https://wa.me/2347080231185?text='), 'WhatsApp URL correct');
  const msg = opened ? decodeURIComponent(opened.split('text=')[1]) : '';
  ok(msg.includes('BASH ESSENTIAL VENTURES'), 'message has store name');
  ok(msg.includes('Apple iPhone 15 Pro Max'), 'message has product name');
  ok(msg.includes('Qty: 1'), 'message has quantity');
  ok(msg.includes('₦1,749,000'), 'message has price');
  ok(msg.includes('Musa Test') && msg.includes('08031234567') && msg.includes('12 Test Street'), 'message has customer details');

  /* validation: empty form must NOT open WhatsApp */
  opened = null;
  const dom2 = boot('index.html');
  const w2 = dom2.window, d2 = w2.document;
  /* pre-seed cart in second page load */
  w2.localStorage.setItem('bev_cart_v1', JSON.stringify({ 'jbl-flip-6': 2 }));
  d2.querySelector('[data-add]').click(); /* re-renders cart UI + badge */
  w2.BEV.openCart();
  w2.open = url => { opened = url; };
  d2.getElementById('waOrderForm').dispatchEvent(new w2.Event('submit', { bubbles: true, cancelable: true }));
  ok(!opened, 'empty customer details block ordering (validation works)');
}

/* ---------- shop page: search / filter / sort ---------- */
console.log('\n[4] Shop page — search, filters, sorting');
{
  const dom = boot('shop.html', 'https://bev.test/shop.html?q=iphone');
  const d = dom.window.document;
  let n = d.querySelectorAll('#productGrid .card').length;
  ok(n === 6, `search "iphone" → 6 results incl. iPhone accessories (got ${n})`);
  const name = d.querySelector('#productGrid .card .p-name').textContent;
  ok(/iphone/i.test(name), 'results match query');
}
{
  const dom = boot('shop.html', 'https://bev.test/shop.html?cat=phones%2Fsamsung');
  const d = dom.window.document;
  ok(d.querySelectorAll('#productGrid .card').length === 4, 'category filter phones/samsung → 4');
}
{
  const dom = boot('shop.html', 'https://bev.test/shop.html?sort=price-asc');
  const d = dom.window.document;
  const first = d.querySelector('#productGrid .card .price').textContent.replace(/[₦,]/g, '');
  ok(Number(first) === 4500, `price ascending — cheapest first (₦${first})`);
}
{
  const dom = boot('shop.html', 'https://bev.test/shop.html?sort=price-desc');
  const d = dom.window.document;
  const first = d.querySelector('#productGrid .card .price').textContent.replace(/[₦,]/g, '');
  ok(Number(first) === 1749000, `price descending — most expensive first (₦${first})`);
}
{
  const dom = boot('shop.html', 'https://bev.test/shop.html?sale=1');
  const d = dom.window.document;
  ok(d.querySelectorAll('#productGrid .card').length === 13, 'on-sale filter → 13');
}
{
  const dom = boot('shop.html', 'https://bev.test/shop.html?q=zzznothing');
  const d = dom.window.document;
  ok(d.querySelectorAll('#productGrid .card').length === 0 && d.getElementById('emptyState').style.display === 'block', 'no-match search shows empty state');
}
{
  const dom = boot('shop.html', 'https://bev.test/shop.html');
  const w = dom.window, d = w.document;
  /* live search (debounced) */
  const q = d.getElementById('qInput');
  q.value = 'galaxy';
  q.dispatchEvent(new w.Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 450));
  const n2 = d.querySelectorAll('#productGrid .card').length;
  ok(n2 === 7, `live search "galaxy" → 7 incl. desc matches (got ${n2})`);
  ok(w.location.search.includes('q=galaxy'), 'URL syncs with search term');
  /* clear, then brand filter */
  q.value = '';
  q.dispatchEvent(new w.Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 450));
  const brandSel = d.getElementById('brandSel');
  brandSel.value = 'Oraimo';
  brandSel.dispatchEvent(new w.Event('change', { bubbles: true }));
  const names = [...d.querySelectorAll('#productGrid .card .p-name')].map(e => e.textContent);
  ok(names.length === 5 && names.every(t => /freepods|boom|charger|power bank/i.test(t)),
     `brand filter Oraimo → 5 items (got ${names.length})`);
}

console.log(`\n===== RESULT: ${pass} passed, ${fail} failed =====`);
process.exit(fail ? 1 : 0);
