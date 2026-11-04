/* ============================================================
   BASH ESSENTIAL VENTURES — App logic
   Cart · Search · Filters · WhatsApp ordering
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const fmt = n => '₦' + Number(n).toLocaleString('en-NG');
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const param = key => new URLSearchParams(location.search).get(key);

  const byId = id => PRODUCTS.find(p => p.id === id);
  const catOf = p => CAT_BY_ID[p.cat];

  /* ---------- Reusable SVG icons ---------- */
  const ICON = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    cartPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>'
  };

  /* ---------- Stars ---------- */
  function stars(rating) {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  /* ============================================================
     CART (localStorage)
     ============================================================ */
  const CART_KEY = 'bev_cart_v1';
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { cart = {}; }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* private mode */ }
  }
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = () => Object.entries(cart).reduce((sum, [id, q]) => {
    const p = byId(id); return p ? sum + p.price * q : sum;
  }, 0);

  function addToCart(id, qty) {
    qty = qty || 1;
    if (!byId(id)) return;
    cart[id] = (cart[id] || 0) + qty;
    saveCart(); syncCartUI(); renderCartItems();
  }
  function setQty(id, q) {
    if (q <= 0) { delete cart[id]; } else { cart[id] = q; }
    saveCart(); syncCartUI(); renderCartItems();
  }
  function removeFromCart(id) { delete cart[id]; saveCart(); syncCartUI(); renderCartItems(); }

  function syncCartUI() {
    const n = cartCount();
    $$('.cart-badge').forEach(b => {
      b.textContent = n > 99 ? '99+' : n;
      b.dataset.empty = n ? '0' : '1';
      if (n) { b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 260); }
    });
    const head = $('#cartCountHead');
    if (head) head.textContent = n;
  }

  /* ============================================================
     TOASTS
     ============================================================ */
  function toast(msg, actionLabel, actionFn) {
    const wrap = $('#toastWrap');
    if (!wrap) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.innerHTML = '<span class="tick">' + ICON.check + '</span><span class="grow">' + esc(msg) + '</span>';
    if (actionLabel) {
      const b = document.createElement('button');
      b.textContent = actionLabel;
      b.addEventListener('click', () => { actionFn && actionFn(); t.remove(); });
      t.appendChild(b);
    }
    wrap.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 380); }, 3200);
  }

  /* ============================================================
     PRODUCT CARD
     ============================================================ */
  function productCard(p) {
    const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const tags = [];
    if (off) tags.push('<span class="pill pill-off">-' + off + '%</span>');
    if (p.badge) tags.push('<span class="pill pill-badge">' + esc(p.badge) + '</span>');
    const el = document.createElement('article');
    el.className = 'card reveal';
    el.innerHTML =
      '<div class="img-wrap">' +
        '<div class="tags">' + tags.join('') + '</div>' +
        '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' +
      '</div>' +
      '<div class="body">' +
        '<span class="p-brand">' + esc(p.brand) + '</span>' +
        '<h3 class="p-name">' + esc(p.name) + '</h3>' +
        '<p class="p-desc">' + esc(p.desc) + '</p>' +
        '<div class="p-rating"><span class="stars" aria-hidden="true">' + stars(p.rating) + '</span><span>' + p.rating.toFixed(1) + ' (' + p.reviews + ')</span></div>' +
        '<div class="p-pricing"><span class="price">' + fmt(p.price) + '</span>' +
        (p.oldPrice ? '<span class="old">' + fmt(p.oldPrice) + '</span>' : '') + '</div>' +
        '<button class="add-btn" type="button" data-add="' + esc(p.id) + '" aria-label="Add ' + esc(p.name) + ' to cart">' + ICON.cartPlus + 'Add to Cart</button>' +
      '</div>';
    return el;
  }

  /* Delegate add-to-cart clicks anywhere on the page */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const id = btn.getAttribute('data-add');
    addToCart(id, 1);
    const p = byId(id);
    toast(p.name + ' added to cart', 'View Cart', openCart);
    btn.classList.add('added');
    const old = btn.innerHTML;
    btn.innerHTML = ICON.check + 'Added ✓';
    setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = old; }, 1200);
  });

  /* ============================================================
     HORIZONTAL SHELVES (homepage)
     ============================================================ */
  const SHELVES = [
    { id: 'featured',  eyebrow: 'Handpicked', title: 'Featured Smartphones', note: 'The phones everyone is talking about', filter: p => p.cat === 'phones' && p.featured, link: 'shop.html?cat=phones' },
    { id: 'offers',    eyebrow: 'Save Big', title: 'Special Offers', note: 'Genuine products at slashed prices — while stock lasts', filter: p => p.oldPrice, link: 'shop.html?sale=1', countdown: true },
    { id: 'samsung',   eyebrow: 'Galaxy Collection', title: 'Samsung Smartphones', note: 'Flagship power to everyday value', filter: p => p.sub === 'samsung', link: 'shop.html?cat=phones%2Fsamsung' },
    { id: 'apple',     eyebrow: 'iPhone Zone', title: 'Apple iPhones', note: 'Genuine iPhones with guaranteed authenticity', filter: p => p.sub === 'apple', link: 'shop.html?cat=phones%2Fapple' },
    { id: 'infinix',   eyebrow: 'Big Battery Energy', title: 'Infinix Smartphones', note: 'Style and stamina that won’t break the bank', filter: p => p.sub === 'infinix', link: 'shop.html?cat=phones%2Finfinix' },
    { id: 'tecno',     eyebrow: 'Camera Kings', title: 'Tecno Smartphones', note: 'Camera-first phones at honest prices', filter: p => p.sub === 'tecno', link: 'shop.html?cat=phones%2Ftecno' },
    { id: 'xiaomi',    eyebrow: 'Value Flagships', title: 'Xiaomi, Redmi & More', note: 'Spec-heavy Android stars incl. Pixel & itel', filter: p => p.sub === 'xiaomi' || p.sub === 'other', link: 'shop.html?cat=phones%2Fxiaomi' },
    { id: 'headphones',eyebrow: 'Immersive Sound', title: 'Headphones & Headsets', note: 'Noise cancelling, bass and gaming comfort', filter: p => p.cat === 'audio' && (p.sub === 'headphones' || p.sub === 'headsets' || p.sub === 'gaming'), link: 'shop.html?cat=audio' },
    { id: 'earbuds',   eyebrow: 'True Wireless', title: 'Earbuds & AirPods', note: 'Pocket-size sound for calls and music', filter: p => p.sub === 'earbuds', link: 'shop.html?cat=audio%2Fearbuds' },
    { id: 'speakers',  eyebrow: 'Party Anywhere', title: 'Bluetooth Speakers', note: 'Waterproof, loud and built to last', filter: p => p.sub === 'speakers', link: 'shop.html?cat=audio%2Fspeakers' },
    { id: 'smart',     eyebrow: 'Wearables', title: 'Smartwatches & Smart Devices', note: 'Stay connected from your wrist', filter: p => p.cat === 'smart', link: 'shop.html?cat=smart' },
    { id: 'power',     eyebrow: 'Stay Charged', title: 'Chargers & Power Banks', note: 'Fast charging for phones and everything else', filter: p => p.sub === 'chargers' || p.sub === 'powerbanks' || p.sub === 'wireless', link: 'shop.html?cat=accessories%2Fchargers' },
    { id: 'access',    eyebrow: 'Essentials', title: 'Cables, Cases & Accessories', note: 'Protect and power your devices', filter: p => p.cat === 'accessories' && ['cables', 'cases', 'protectors', 'car'].includes(p.sub), link: 'shop.html?cat=accessories' },
    { id: 'best',      eyebrow: 'Customer Favourites', title: 'Best Sellers', note: 'What Nigeria is buying right now', filter: p => p.bestseller, link: 'shop.html?sort=rating' }
  ];

  function buildShelf(shelf) {
    const items = PRODUCTS.filter(shelf.filter);
    if (!items.length) return null;

    const section = document.createElement('section');
    section.className = 'shelf';
    section.id = 'shelf-' + shelf.id;

    const countdown = shelf.countdown ? '<div class="countdown" id="dealCountdown">🔥 Deal ends in <span class="clock">--:--:--</span></div>' : '';
    section.innerHTML =
      '<div class="shelf-head">' +
        '<div><span class="eyebrow">' + esc(shelf.eyebrow) + '</span>' +
        '<h2>' + esc(shelf.title) + '</h2>' +
        '<p class="shelf-note">' + esc(shelf.note) + '</p>' + countdown + '</div>' +
        '<div class="shelf-head-actions" style="display:flex;align-items:center;gap:14px;">' +
          '<a class="btn btn-ghost btn-sm" href="' + shelf.link + '">View All ' + ICON.arrow + '</a>' +
          '<div class="shelf-nav"><button type="button" aria-label="Scroll ' + esc(shelf.title) + ' left">' + ICON.left + '</button>' +
          '<button type="button" aria-label="Scroll ' + esc(shelf.title) + ' right">' + ICON.right + '</button></div>' +
        '</div>' +
      '</div>' +
      '<div class="h-scroll-wrap"><div class="h-scroll" role="list" aria-label="' + esc(shelf.title) + ' products"></div></div>';

    const scroller = $('.h-scroll', section);
    items.forEach(p => { const c = productCard(p); c.setAttribute('role', 'listitem'); scroller.appendChild(c); });

    const [prev, next] = $$('button', section);
    const step = () => Math.min(scroller.clientWidth * 0.8, 900);
    prev.addEventListener('click', () => scroller.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => scroller.scrollBy({ left: step(), behavior: 'smooth' }));

    return section;
  }

  function renderShelves() {
    const mount = $('#shelves');
    if (!mount) return;
    SHELVES.forEach(s => {
      const el = buildShelf(s);
      if (el) mount.appendChild(el);
    });
    startCountdown();
  }

  /* Weekly deal countdown — ticks to end of the week (Sunday 23:59) */
  function startCountdown() {
    const el = $('#dealCountdown .clock');
    if (!el) return;
    function tick() {
      const now = new Date();
      const end = new Date(now);
      end.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
      end.setHours(23, 59, 59, 0);
      let s = Math.max(0, Math.floor((end - now) / 1000));
      const d = Math.floor(s / 86400); s %= 86400;
      const h = Math.floor(s / 3600); s %= 3600;
      const m = Math.floor(s / 60); s %= 60;
      const pad = n => String(n).padStart(2, '0');
      el.textContent = d + 'd ' + pad(h) + ':' + pad(m) + ':' + pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================================
     CATEGORY TILES (homepage)
     ============================================================ */
  function renderCategories() {
    const grid = $('#catGrid');
    if (!grid) return;
    CATEGORIES.forEach((c, i) => {
      const count = PRODUCTS.filter(p => p.cat === c.id).length;
      const a = document.createElement('a');
      a.className = 'cat-tile reveal';
      a.dataset.d = String(i % 4);
      a.href = 'shop.html?cat=' + c.id;
      a.innerHTML =
        '<span class="cat-count">' + count + ' items</span>' +
        '<div><div class="cat-icon" aria-hidden="true">' + c.icon + '</div>' +
        '<h3>' + esc(c.name) + '</h3><p>' + esc(c.blurb) + '</p></div>' +
        '<span class="cat-go">Shop now ' + ICON.arrow + '</span>';
      grid.appendChild(a);
    });
  }

  /* ============================================================
     SHOP PAGE — search, filters, sorting
     ============================================================ */
  const shopState = {
    q: (param('q') || '').trim(),
    cat: param('cat') || '',
    brand: param('brand') || '',
    sale: param('sale') === '1',
    sort: param('sort') || 'featured'
  };

  function initShop() {
    const grid = $('#productGrid');
    if (!grid) return;

    const qInput = $('#qInput'), catSel = $('#catSel'), brandSel = $('#brandSel'),
          sortSel = $('#sortSel'), saleBtn = $('#saleBtn'), chips = $('#activeChips'),
          countEl = $('#resultCount'), emptyEl = $('#emptyState');

    /* populate category select: top-level + nested subs */
    catSel.innerHTML = '<option value="">All Categories</option>' +
      CATEGORIES.map(c =>
        '<option value="' + c.id + '">' + c.icon + ' ' + esc(c.name) + '</option>' +
        c.subs.map(s => '<option value="' + c.id + '/' + s.id + '">— ' + esc(s.name) + '</option>').join('')
      ).join('');

    brandSel.innerHTML = '<option value="">All Brands</option>' +
      BRANDS.map(b => '<option value="' + esc(b) + '">' + esc(b) + '</option>').join('');

    qInput.value = shopState.q;
    catSel.value = shopState.cat;
    brandSel.value = shopState.brand;
    sortSel.value = shopState.sort;
    saleBtn.setAttribute('aria-pressed', shopState.sale ? 'true' : 'false');
    saleBtn.classList.toggle('active', shopState.sale);

    function apply() {
      const q = shopState.q.toLowerCase();
      let items = PRODUCTS.filter(p => {
        if (q && !(p.name + ' ' + p.brand + ' ' + p.desc).toLowerCase().includes(q)) return false;
        if (shopState.cat) {
          const [c, s] = shopState.cat.split('/');
          if (p.cat !== c || (s && p.sub !== s)) return false;
        }
        if (shopState.brand && p.brand !== shopState.brand) return false;
        if (shopState.sale && !p.oldPrice) return false;
        return true;
      });

      const sorters = {
        'featured':   (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating,
        'price-asc':  (a, b) => a.price - b.price,
        'price-desc': (a, b) => b.price - a.price,
        'rating':     (a, b) => b.rating - a.rating || b.reviews - a.reviews,
        'name-asc':   (a, b) => a.name.localeCompare(b.name),
        'discount':   (a, b) => ((b.oldPrice ? 1 - b.price / b.oldPrice : 0) - (a.oldPrice ? 1 - a.price / a.oldPrice : 0))
      };
      items.sort(sorters[shopState.sort] || sorters.featured);

      grid.innerHTML = '';
      items.forEach(p => grid.appendChild(productCard(p)));
      observeReveals();

      countEl.innerHTML = items.length
        ? 'Showing <b>' + items.length + '</b> product' + (items.length > 1 ? 's' : '')
        : 'No products found';
      emptyEl.style.display = items.length ? 'none' : 'block';

      /* active filter chips */
      chips.innerHTML = '';
      function chip(label, clear) {
        const c = document.createElement('span');
        c.className = 'chip';
        c.innerHTML = esc(label) + '<button type="button" aria-label="Remove filter ' + esc(label) + '">✕</button>';
        $('button', c).addEventListener('click', clear);
        chips.appendChild(c);
      }
      if (shopState.q) chip('“' + shopState.q + '”', () => { shopState.q = ''; qInput.value = ''; sync(); });
      if (shopState.cat) {
        const [c, s] = shopState.cat.split('/');
        const label = s ? SUB_NAME[shopState.cat] : CAT_BY_ID[c].name;
        chip(label, () => { shopState.cat = ''; catSel.value = ''; sync(); });
      }
      if (shopState.brand) chip(shopState.brand, () => { shopState.brand = ''; brandSel.value = ''; sync(); });
      if (shopState.sale) chip('On Sale', () => { shopState.sale = false; saleBtn.setAttribute('aria-pressed', 'false'); saleBtn.classList.remove('active'); sync(); });
    }

    /* keep URL shareable */
    function sync() {
      const u = new URL(location.pathname, location.origin);
      const sp = new URLSearchParams();
      if (shopState.q) sp.set('q', shopState.q);
      if (shopState.cat) sp.set('cat', shopState.cat);
      if (shopState.brand) sp.set('brand', shopState.brand);
      if (shopState.sale) sp.set('sale', '1');
      if (shopState.sort !== 'featured') sp.set('sort', shopState.sort);
      const qs = sp.toString();
      history.replaceState(null, '', 'shop.html' + (qs ? '?' + qs : ''));
      apply();
    }

    let deb;
    qInput.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => { shopState.q = qInput.value.trim(); sync(); }, 220); });
    catSel.addEventListener('change', () => { shopState.cat = catSel.value; sync(); });
    brandSel.addEventListener('change', () => { shopState.brand = brandSel.value; sync(); });
    sortSel.addEventListener('change', () => { shopState.sort = sortSel.value; sync(); });
    saleBtn.addEventListener('click', () => {
      shopState.sale = !shopState.sale;
      saleBtn.setAttribute('aria-pressed', shopState.sale ? 'true' : 'false');
      saleBtn.classList.toggle('active', shopState.sale);
      sync();
    });
    $('#clearAll') && $('#clearAll').addEventListener('click', () => {
      shopState.q = ''; shopState.cat = ''; shopState.brand = ''; shopState.sale = false; shopState.sort = 'featured';
      qInput.value = ''; catSel.value = ''; brandSel.value = ''; sortSel.value = 'featured';
      saleBtn.setAttribute('aria-pressed', 'false'); saleBtn.classList.remove('active');
      sync();
    });
    $('#emptyReset') && $('#emptyReset').addEventListener('click', () => $('#clearAll').click());

    apply();
  }

  /* ============================================================
     CART DRAWER
     ============================================================ */
  function renderCartItems() {
    const wrap = $('#cartItems');
    if (!wrap) return;
    const ids = Object.keys(cart);

    if (!ids.length) {
      wrap.innerHTML =
        '<div class="cart-empty"><div class="big">🛒</div><h4>Your cart is empty</h4>' +
        '<p>Fill it with amazing gadgets.</p>' +
        '<a class="btn btn-gold btn-sm" style="margin-top:18px" href="shop.html">Start Shopping</a></div>';
    } else {
      wrap.innerHTML = '';
      ids.forEach(id => {
        const p = byId(id);
        if (!p) { delete cart[id]; return; }
        const q = cart[id];
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML =
          '<div class="ci-img"><img src="' + esc(p.img) + '" alt="" loading="lazy"></div>' +
          '<div><div class="ci-name">' + esc(p.name) + '</div>' +
          '<div class="ci-price">' + fmt(p.price) + ' × ' + q + ' = ' + fmt(p.price * q) + '</div></div>' +
          '<div class="ci-side">' +
            '<div class="qty-stepper">' +
              '<button type="button" data-qty="-1" data-id="' + esc(id) + '" aria-label="Decrease quantity">−</button>' +
              '<span class="q">' + q + '</span>' +
              '<button type="button" data-qty="1" data-id="' + esc(id) + '" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" class="ci-remove" data-remove="' + esc(id) + '">' + ICON.trash + 'Remove</button>' +
          '</div>';
        wrap.appendChild(el);
      });
    }

    const sub = cartSubtotal();
    const subEl = $('#cartSubtotal'), totEl = $('#cartTotal');
    if (subEl) subEl.textContent = fmt(sub);
    if (totEl) totEl.textContent = fmt(sub);
    const coForm = $('#coForm');
    if (coForm) coForm.style.display = ids.length ? 'grid' : 'none';
    const waBtn = $('#waOrderBtn');
    if (waBtn) waBtn.style.display = ids.length ? 'inline-flex' : 'none';
  }

  document.addEventListener('click', e => {
    const qBtn = e.target.closest('[data-qty]');
    if (qBtn) {
      const id = qBtn.dataset.id;
      setQty(id, (cart[id] || 0) + parseInt(qBtn.dataset.qty, 10));
      return;
    }
    const rBtn = e.target.closest('[data-remove]');
    if (rBtn) {
      const p = byId(rBtn.dataset.remove);
      removeFromCart(rBtn.dataset.remove);
      if (p) toast(p.name + ' removed from cart');
    }
  });

  /* ---------- Drawer open/close ---------- */
  function openCart() {
    const d = $('#cartDrawer'), o = $('#drawerOverlay');
    if (!d) return;
    d.classList.add('open'); o && o.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    const d = $('#cartDrawer'), o = $('#drawerOverlay');
    d && d.classList.remove('open'); o && o.classList.remove('show');
    document.body.style.overflow = '';
  }
  function openNav() {
    const d = $('#navDrawer'), o = $('#drawerOverlay');
    d.classList.add('open'); o && o.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    const d = $('#navDrawer'), o = $('#drawerOverlay');
    d && d.classList.remove('open'); o && o.classList.remove('show');
    document.body.style.overflow = '';
  }
  window.BEV = { openCart: openCart, closeCart: closeCart };

  /* ============================================================
     WHATSAPP ORDER
     ============================================================ */
  function buildWhatsAppMessage(details) {
    const lines = [];
    lines.push('*BASH ESSENTIAL VENTURES*');
    lines.push('*🛒 NEW ORDER*');
    lines.push('------------------------------');
    lines.push('*Order Items:*');
    let i = 1;
    Object.entries(cart).forEach(([id, q]) => {
      const p = byId(id);
      if (!p) return;
      lines.push(i + '. ' + p.name);
      lines.push('    Qty: ' + q + ' × ' + fmt(p.price) + ' = *' + fmt(p.price * q) + '*');
      i++;
    });
    const sub = cartSubtotal();
    lines.push('------------------------------');
    lines.push('Subtotal: *' + fmt(sub) + '*');
    lines.push('Delivery: To be confirmed');
    lines.push('*TOTAL: ' + fmt(sub) + '*');
    lines.push('------------------------------');
    lines.push('*👤 Customer Details*');
    lines.push('Name: ' + details.name);
    lines.push('Phone: ' + details.phone);
    lines.push('Address: ' + details.address);
    if (details.note) lines.push('Note: ' + details.note);
    lines.push('------------------------------');
    const d = new Date();
    lines.push('📅 ' + d.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }));
    lines.push('Sent from bashessentialventures website 🖤');
    return lines.join('\n');
  }

  function handleWhatsAppOrder(e) {
    e.preventDefault();
    if (!Object.keys(cart).length) { toast('Your cart is empty — add products first'); return; }

    const name = $('#coName'), phone = $('#coPhone'), address = $('#coAddress'), note = $('#coNote'), msg = $('#formMsg');
    let bad = null;
    [name, phone, address].forEach(f => {
      const empty = !f.value.trim();
      f.classList.toggle('err', empty);
      if (empty && !bad) bad = f;
    });
    if (bad) {
      msg.textContent = 'Please fill in your name, phone number and delivery address.';
      bad.focus();
      return;
    }
    msg.textContent = '';

    const text = encodeURIComponent(buildWhatsAppMessage({
      name: name.value.trim(),
      phone: phone.value.trim(),
      address: address.value.trim(),
      note: note.value.trim()
    }));
    window.open('https://wa.me/' + STORE.whatsapp + '?text=' + text, '_blank', 'noopener');
    toast('Opening WhatsApp with your order… 🚀');
  }

  /* ============================================================
     HEADER SEARCH (both pages)
     ============================================================ */
  function initSearchForms() {
    $$('form[data-search]').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = $('input', form);
        const q = input.value.trim();
        window.location.href = 'shop.html' + (q ? '?q=' + encodeURIComponent(q) : '');
      });
    });
  }

  /* ============================================================
     SCROLL REVEALS
     ============================================================ */
  let io = null;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('in')); return; }
    if (!io) {
      io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    }
    $$('.reveal:not(.in)').forEach(el => io.observe(el));
  }

  /* ============================================================
     HEADER SHADOW + IMAGE FALLBACKS
     ============================================================ */
  function initChrome() {
    const header = $('.site-header');
    if (header) {
      const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Official Cloudinary images with local fallbacks */
    $$('img[data-fallback]').forEach(img => {
      img.addEventListener('error', function h() {
        if (img.dataset.fallbackUsed) return;
        img.dataset.fallbackUsed = '1';
        img.src = img.dataset.fallback;
      });
    });

    /* Cart + nav drawer wiring */
    $$('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));
    $$('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));
    $$('[data-open-nav]').forEach(b => b.addEventListener('click', openNav));
    $$('[data-close-nav]').forEach(b => b.addEventListener('click', closeNav));
    const overlay = $('#drawerOverlay');
    overlay && overlay.addEventListener('click', () => { closeCart(); closeNav(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeNav(); } });

    const waForm = $('#waOrderForm');
    waForm && waForm.addEventListener('submit', handleWhatsAppOrder);

    /* dynamic year */
    $$('.year').forEach(el => el.textContent = new Date().getFullYear());
  }

  /* ============================================================
     BOOT (works whether scripts run before or after DOMContentLoaded)
     ============================================================ */
  function init() {
    renderCategories();
    renderShelves();
    initShop();
    initSearchForms();
    initChrome();
    renderCartItems();
    syncCartUI();
    observeReveals();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
