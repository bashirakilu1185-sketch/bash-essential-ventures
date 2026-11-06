/* ==========================================================================
   EL BASH SMART TECH HUB — storefront application
   Vanilla JS, no build step. Depends on assets/js/products.js (BUSINESS,
   CATEGORIES, PRODUCTS) which is loaded first.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------- helpers ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const nf = new Intl.NumberFormat('en-NG');
  const money = (n) => '\u20A6' + nf.format(Math.round(n));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const STORE_KEY = 'bash-cart-v1';

  /* ---------------- WhatsApp helpers ---------------- */
  function waUrl(message) {
    const base = BUSINESS.whatsappBase;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  const generalMessage = () =>
    `Hello ${BUSINESS.name}, I would like to make an enquiry about your electronics. Please share more details.`;

  const productMessage = (product) =>
    `Hello ${BUSINESS.name}, I would like to order:\n\n` +
    `• ${product.name}\n` +
    `• Price: ${money(product.price)}\n\n` +
    `Please confirm availability, final price, and delivery details.`;

  /* ---------------- state ---------------- */
  const state = {
    cart: loadCart(),
    category: 'all',
    query: '',
    sort: 'featured'
  };

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // keep only items that still exist in the catalogue, clamp quantities
      return parsed
        .map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.id);
          if (!product) return null;
          const qty = Math.max(1, Math.min(99, Math.floor(Number(item.qty) || 1)));
          return { id: product.id, qty };
        })
        .filter(Boolean);
    } catch (err) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state.cart));
    } catch (err) {
      /* storage may be unavailable (private mode / file://) — cart still works in memory */
    }
  }

  const cartCount = () => state.cart.reduce((n, i) => n + i.qty, 0);
  const cartSubtotal = () =>
    state.cart.reduce((sum, i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);

  /* ---------------- icons ---------------- */
  const ICONS = {
    headphones: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4.5" height="7" rx="2"/><rect x="17" y="13" width="4.5" height="7" rx="2"/></svg>',
    earbuds: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5a3.5 3.5 0 0 1 3.5 3.5v3a3.5 3.5 0 0 1-7 0V8A3.5 3.5 0 0 1 8 4.5Z"/><path d="M8 14.5V18a2.5 2.5 0 0 0 5 0"/><path d="M16 4.5a3.5 3.5 0 0 1 3.5 3.5v3a3.5 3.5 0 0 1-7 0V8A3.5 3.5 0 0 1 16 4.5Z"/><path d="M16 14.5V18a2.5 2.5 0 0 1-5 0"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="4"/><circle cx="12" cy="9" r="2.4"/><circle cx="12" cy="16" r="2.8"/></svg>',
    watch: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="6" width="11" height="12" rx="3"/><path d="M9 6V3.5h6V6M9 18v2.5h6V18"/><path d="M12 10v2.2l1.4 1"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4.8 13.2H11l-.9 8.8L19.2 10H13l0-8Z"/></svg>',
    battery: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="7" width="16" height="10" rx="2.5"/><path d="M21.5 10.5v3"/><path d="M6 10.5v3M9.5 10.5v3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M11 18.5h2"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.8 9.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20 7H6.2"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17.5" cy="19" r="1.4"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.5 12.5 5 5L19.5 6.5"/></svg>',
    image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m4.5 17 4.7-4.4a2 2 0 0 1 2.7 0l3.1 2.8"/><path d="m14 15.5 1.9-1.8a2 2 0 0 1 2.7 0l1.9 1.7"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.5-4.5a8.4 8.4 0 1 1 15.5-4.4Z"/><path d="M8.4 8.2c.3-.7.6-.7 1-.7h.6c.2 0 .5 0 .7.5l.7 1.7c.1.3 0 .5-.2.7l-.5.6c-.2.2-.3.4-.1.7a6 6 0 0 0 2.9 2.5c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.5.3.5.5a2 2 0 0 1-1.4 1.7c-.5.2-1.2.2-3.4-.7a9.4 9.4 0 0 1-4-3.7c-.8-1.3-.9-2.4-.6-3.2Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13"/><path d="m12 5 7 7-7 7"/></svg>',
    exclaim: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16.2v.1"/></svg>'
  };

  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || { name: 'Electronics' }).name;

  /* ---------------- images ----------------
     Every visual can resolve three ways, in this order:

     1. window.BASH_IMAGE_MANIFEST   - injected by the standalone build, maps a
        logical path to embedded data URIs so the page works with no files and
        no network (e.g. opened straight from an Android download folder).
     2. Absolute http(s) URLs         - used as-is (e.g. Cloudinary).
     3. Local relative paths          - assets/img/... when the full project is
        hosted or opened from a complete folder.

     Each image renders as <picture> with WebP + JPEG sources. If the primary
     source fails, onerror swaps to the fallback URL before giving up and
     showing the placeholder, so one bad path never leaves a broken icon. */
  const MANIFEST = (typeof window !== 'undefined' && window.BASH_IMAGE_MANIFEST) || {};
  const isAbsolute = (u) => /^(https?:)?\/\//i.test(String(u)) || /^data:/i.test(String(u));
  const jpgOf = (path) => (isAbsolute(path) ? String(path) : String(path).replace(/\.webp$/i, '.jpg'));

  function variants(path) {
    const m = MANIFEST[path];
    if (m) return { webp: m.webp || m.src || path, jpg: m.jpg || m.src || path };
    return { webp: path, jpg: jpgOf(path) };
  }

  function picture(path, alt, extraAttrs) {
    const attrs = extraAttrs || '';
    const v = variants(path);
    // only emit a <source> when it actually differs from the <img> fallback
    const webpSource = v.webp !== v.jpg ? `<source srcset="${v.webp}" type="image/webp">` : '';
    return `<picture>
        ${webpSource}
        <img src="${v.jpg}" data-fallback="${v.webp !== v.jpg ? v.webp : ''}" alt="${esc(alt)}" loading="lazy" decoding="async" width="960" height="960" ${attrs}>
      </picture>`;
  }

  /* ---------------- image fallback ---------------- */
  function attachImageFallback(img, label) {
    const media = img.closest('.pc-media') || img.parentElement;
    const fail = () => {
      img.style.display = 'none';
      if (media) media.classList.add('is-fallback');
      const holder = media && media.querySelector('.pc-fallback');
      if (holder && label) {
        holder.innerHTML = ICONS.image + '<span>' + esc(label) + '</span>';
      }
    };
    img.addEventListener('error', function onError() {
      // one retry against the alternate format / embedded copy, then placeholder
      const alt = img.getAttribute('data-fallback');
      if (alt && img.src !== alt) {
        img.setAttribute('data-fallback', '');
        img.src = alt;
        return;
      }
      img.removeEventListener('error', onError);
      fail();
    });
    if (img.complete && img.naturalWidth === 0) {
      const alt = img.getAttribute('data-fallback');
      if (alt && img.src !== alt) img.src = alt;
      else fail();
    }
  }

  /* ---------------- static (non-carded) images ---------------- */
  // The hero photo and the owner photo live outside the product grid, so they
  // get the same one-retry-then-hide treatment here instead of inline onerror
  // attributes (keeps the markup free of inline script).
  function wireStaticImages() {
    const hero = document.querySelector('[data-hero-img]');
    if (hero) {
      const heroFallback = () => {
        const card = hero.closest('.hero-card');
        if (card) card.classList.add('is-fallback');
      };
      hero.addEventListener('error', heroFallback, { once: true });
      if (hero.complete && hero.naturalWidth === 0) heroFallback();
    }

    const owner = document.querySelector('[data-owner-img]');
    if (owner) {
      const ownerFallback = () => {
        const media = owner.closest('.owner-media');
        if (media) media.classList.add('is-fallback');
      };
      owner.addEventListener('error', function onOwnerError() {
        const alt = owner.getAttribute('data-fallback-src');
        if (alt && owner.getAttribute('src') !== alt) {
          owner.setAttribute('data-fallback-src', '');
          owner.src = alt;
          return;
        }
        owner.removeEventListener('error', onOwnerError);
        ownerFallback();
      });
      if (owner.complete && owner.naturalWidth === 0) {
        const alt = owner.getAttribute('data-fallback-src');
        if (alt && owner.getAttribute('src') !== alt) owner.src = alt;
        else ownerFallback();
      }
    }
  }

  /* ---------------- toasts ---------------- */
  let toastTimer = null;
  function toast(message, icon) {
    const stack = $('#toastStack');
    if (!stack) return;
    const node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = (icon === 'cart' ? ICONS.cart : ICONS.check) + '<span class="toast-msg">' + message + '</span>';
    stack.appendChild(node);
    const remove = () => {
      node.classList.add('is-out');
      setTimeout(() => node.remove(), 300);
    };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(remove, 2600);
    setTimeout(remove, 4500);
  }

  /* ---------------- stars ---------------- */
  function starsMarkup(rating, reviews) {
    let out = '<span class="stars" aria-hidden="true">';
    for (let i = 1; i <= 5; i++) {
      out += `<svg class="${i <= Math.round(rating) ? 'on' : ''}" viewBox="0 0 24 24"><path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9L12 3.6Z"/></svg>`;
    }
    out += '</span>';
    out += `<span>${rating.toFixed(1)}</span>`;
    out += `<span class="demo-tag" title="Demo data for layout only">demo</span>`;
    if (reviews) out += `<span aria-hidden="true" style="color:var(--muted-2)">(${reviews})</span>`;
    return `<div class="pc-rating" role="img" aria-label="Demo rating ${rating} out of 5 from ${reviews} demo reviews">${out}</div>`;
  }

  /* ---------------- categories ---------------- */
  function renderCategories() {
    const grid = $('#categoryGrid');
    if (!grid) return;
    grid.innerHTML = CATEGORIES.map((cat, index) => {
      const count = PRODUCTS.filter((p) => p.category === cat.id).length;
      return `
        <button class="cat-card reveal" type="button" data-category="${cat.id}" style="transition-delay:${index * 40}ms"
                aria-label="Show ${esc(cat.name)} (${count} product${count === 1 ? '' : 's'})">
          ${picture(cat.image, cat.name + ' category visual')}
          <span class="cat-count">${count} item${count === 1 ? '' : 's'}</span>
          <span class="cat-body">
            <span>
              <span class="cat-name">${esc(cat.name)}</span>
              <span class="cat-tagline">${esc(cat.tagline)}</span>
            </span>
            <span class="cat-go" aria-hidden="true">${ICONS.arrow}</span>
          </span>
        </button>`;
    }).join('');
  }

  function renderFilterChips() {
    const wrap = $('#filterChips');
    if (!wrap) return;
    const chips = [{ id: 'all', name: 'All Products', count: PRODUCTS.length }].concat(
      CATEGORIES.map((c) => ({ id: c.id, name: c.name, count: PRODUCTS.filter((p) => p.category === c.id).length }))
        .filter((c) => c.count > 0)
    );
    wrap.innerHTML = chips
      .map(
        (c) => `<button class="chip" type="button" data-filter="${c.id}"
                  aria-pressed="${state.category === c.id}">
                  ${esc(c.name)} <span class="chip-count">${c.count}</span>
                </button>`
      )
      .join('');
  }

  /* ---------------- collection rails (horizontal carousels) ----------------
     Each rail is a native horizontally-scrollable track, so finger swiping on
     Android/iOS works with no JS at all. The extras layered on top are:
       • prev/next arrow buttons (mouse + keyboard users)
       • drag-to-scroll with a mouse
       • arrow-key support when the track has focus
       • arrow buttons disable themselves at each end of the track
     The catalogue itself is untouched — the rails just render the existing
     product cards for a slice of the same PRODUCTS list. */
  const RAILS = {
    watches: (p) => p.category === 'smartwatch',
    bluetooth: (p) =>
      p.category === 'earbuds' ||
      p.category === 'speakers' ||
      /bluetooth/i.test(p.name) ||
      /bluetooth/i.test(p.blurb || ''),
    headphones: (p) => p.category === 'headphones'
  };

  const railCards = (track) => Array.from(track.querySelectorAll('.product-card'));

  function railStep(track) {
    const card = track.querySelector('.product-card');
    if (!card) return Math.round(track.clientWidth * 0.8);
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    return Math.round(card.getBoundingClientRect().width + gap);
  }

  function scrollRail(track, direction, opts) {
    const behavior = opts && opts.instant ? 'auto' : 'smooth';
    track.scrollBy({ left: direction * railStep(track), behavior });
  }

  function syncRailNav(track) {
    const block = track.closest('.rail-block');
    const prev = block && block.querySelector('[data-rail-prev]');
    const next = block && block.querySelector('[data-rail-next]');
    const max = track.scrollWidth - track.clientWidth;
    const scrollable = max > 4;
    if (block) block.classList.toggle('is-static', !scrollable);
    if (prev) prev.disabled = !scrollable || track.scrollLeft <= 4;
    if (next) next.disabled = !scrollable || track.scrollLeft >= max - 4;
  }

  function wireRail(track) {
    if (track.dataset.wired === '1') {
      syncRailNav(track);
      return;
    }
    track.dataset.wired = '1';

    const block = track.closest('.rail-block');
    if (block) {
      const prev = block.querySelector('[data-rail-prev]');
      const next = block.querySelector('[data-rail-next]');
      if (prev) prev.addEventListener('click', () => scrollRail(track, -1));
      if (next) next.addEventListener('click', () => scrollRail(track, 1));
    }

    track.addEventListener('scroll', () => syncRailNav(track), { passive: true });

    /* keyboard */
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollRail(track, e.key === 'ArrowRight' ? 1 : -1);
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        track.scrollTo({ left: e.key === 'Home' ? 0 : track.scrollWidth, behavior: 'smooth' });
      }
    });

    /* mouse drag-to-scroll (touch keeps native momentum scrolling) */
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;
    let lastDx = 0;
    let suppressClick = false;

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      moved = 0;
      lastDx = 0;
      startX = e.clientX;
      startLeft = track.scrollLeft;
    });

    track.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) <= 3 && !track.classList.contains('is-dragging')) return;
      lastDx = dx;
      moved = Math.abs(dx);
      track.classList.add('is-dragging');
      track.scrollLeft = startLeft - dx;
    });

    const endDrag = () => {
      if (!down) return;
      down = false;
      suppressClick = moved > 6;
      if (!suppressClick) {
        track.classList.remove('is-dragging');
        syncRailNav(track);
        return;
      }
      /* settle on a card: a quick flick advances one card, a slow drag lands on
         the nearest one. Snap stays off during the settle so it cannot bounce. */
      const step = railStep(track);
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      let target = Math.round(track.scrollLeft / step) * step;
      if (lastDx < -60) target = Math.ceil((track.scrollLeft + 4) / step) * step;
      else if (lastDx > 60) target = Math.floor((track.scrollLeft - 4) / step) * step;
      target = Math.max(0, Math.min(max, target));
      track.scrollTo({ left: target, behavior: 'smooth' });

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        track.removeEventListener('scrollend', finish);
        track.classList.remove('is-dragging');
        syncRailNav(track);
      };
      track.addEventListener('scrollend', finish);
      setTimeout(finish, 600);
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointerleave', endDrag);
    track.addEventListener('pointercancel', endDrag);

    /* a drag must never fire a click on a card underneath */
    track.addEventListener(
      'click',
      (e) => {
        if (!suppressClick) return;
        suppressClick = false;
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );

    /* images wider than the track on resize */
    window.addEventListener('resize', () => syncRailNav(track));
    syncRailNav(track);
  }

  function renderRails() {
    $$('.rail-track[data-rail]').forEach((track) => {
      const match = RAILS[track.dataset.rail];
      if (!match) return;
      const items = sortProducts(PRODUCTS.filter(match));
      track.innerHTML = items.length
        ? items.map(productCard).join('')
        : '<p class="rail-empty">No products in this collection yet.</p>';
      $$('.pc-media img', track).forEach((img) => {
        const card = img.closest('.product-card');
        const p = PRODUCTS.find((x) => x.id === card.dataset.id);
        attachImageFallback(img, p ? p.name : '');
      });
      wireRail(track);
    });
  }

  function renderFooterCategories() {
    const list = $('#footerCats');
    if (!list) return;
    list.innerHTML = CATEGORIES.map(
      (c) => `<li><a href="#products" data-filter="${c.id}">${esc(c.name)}</a></li>`
    ).join('');
  }

  /* ---------------- product card ---------------- */
  function productCard(p) {
    const badge = p.badge
      ? `<span class="pc-badge${p.badge.toLowerCase() === 'new' ? ' badge-new' : ''}">${esc(p.badge)}</span>`
      : '';
    return `
      <article class="product-card reveal" data-id="${p.id}">
        <div class="pc-media">
          ${badge}
          <a class="pc-wa" href="${waUrl(productMessage(p))}" target="_blank" rel="noopener noreferrer"
             aria-label="Order ${esc(p.name)} on WhatsApp" title="Order on WhatsApp">${ICONS.wa}</a>
          ${picture(p.image, p.imageAlt)}
          <div class="pc-fallback">${ICONS.image}<span>${esc(p.name)}</span></div>
        </div>
        <div class="pc-body">
          <span class="pc-cat">${esc(catName(p.category))}</span>
          ${p.sample ? '<span class="pc-sample">SAMPLE – EDITABLE</span>' : ''}
          <h3 class="pc-name">${esc(p.name)}</h3>
          <p class="pc-blurb">${esc(p.blurb)}</p>
          ${starsMarkup(p.rating, p.reviews)}
          <div class="pc-foot">
            <div class="pc-price">
              <span class="price-now">${money(p.price)}</span>
              ${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span>` : ''}
              ${p.sample ? '<span class="price-note">sample price</span>' : ''}
            </div>
            <button class="add-btn" type="button" data-add="${p.id}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
              Add
            </button>
          </div>
        </div>
      </article>`;
  }

  /* ---------------- filtering + rendering ---------------- */
  function matches(p) {
    const q = state.query.trim().toLowerCase();
    const inCategory = state.category === 'all' || p.category === state.category;
    const inQuery = !q || p.name.toLowerCase().includes(q) || catName(p.category).toLowerCase().includes(q);
    return inCategory && inQuery;
  }

  function sortProducts(list) {
    const arr = list.slice();
    switch (state.sort) {
      case 'price-asc': return arr.sort((a, b) => a.price - b.price);
      case 'price-desc': return arr.sort((a, b) => b.price - a.price);
      case 'name-asc': return arr.sort((a, b) => a.name.localeCompare(b.name));
      default: return arr.sort((a, b) => (b.featured === true) - (a.featured === true));
    }
  }

  function renderProducts() {
    const grid = $('#productGrid');
    const empty = $('#emptyState');
    const results = $('#resultsLine');
    if (!grid) return;

    const filtered = sortProducts(PRODUCTS.filter(matches));
    grid.innerHTML = filtered.map(productCard).join('');
    $$('.pc-media img', grid).forEach((img, i) => {
      const card = img.closest('.product-card');
      const p = PRODUCTS.find((x) => x.id === card.dataset.id);
      attachImageFallback(img, p ? p.name : '');
    });

    const isEmpty = filtered.length === 0;
    grid.hidden = isEmpty;
    if (empty) empty.hidden = !isEmpty;

    if (results) {
      const catLabel = state.category === 'all' ? 'all categories' : catName(state.category);
      const q = state.query.trim();
      results.innerHTML = isEmpty
        ? `No products found${q ? ` for “${esc(q)}”` : ''} in ${esc(catLabel)}.`
        : `Showing <strong>${filtered.length}</strong> of ${PRODUCTS.length} products` +
          (q ? ` for “${esc(q)}”` : '') +
          ` · <strong>${esc(catLabel)}</strong>`;
    }

    if (isEmpty && $('#emptyCopy')) {
      const q = state.query.trim();
      $('#emptyCopy').textContent = q
        ? `We couldn’t find “${q}”. Try a shorter keyword, or reset the filters to browse everything.`
        : 'There are no products in this category yet. Reset the filters to see the full catalogue.';
    }

    wireStaticImages();
    renderFilterChips();
    observeReveals();
  }

  function setCategory(id, opts = {}) {
    state.category = id;
    if (opts.scroll !== false) {
      const target = $('#products');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    renderProducts();
    $$('.chip', $('#filterChips')).forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.filter === id));
    });
  }

  function resetFilters(scroll) {
    state.category = 'all';
    state.query = '';
    state.sort = 'featured';
    const search = $('#shopSearch');
    if (search) search.value = '';
    const headerSearch = $('#headerSearch');
    if (headerSearch) headerSearch.value = '';
    const mobileSearch = $('#mobileSearch');
    if (mobileSearch) mobileSearch.value = '';
    const sortSelect = $('#sortSelect');
    if (sortSelect) sortSelect.value = 'featured';
    if ($('#clearSearch')) $('#clearSearch').hidden = true;
    renderProducts();
    if (scroll) {
      const target = $('#products');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ---------------- deals ---------------- */
  function renderDeals() {
    const wrap = $('#dealsCards');
    if (!wrap) return;
    // 4 cards: discounted items first, then new arrivals, then featured picks
    const onSale = PRODUCTS.filter((p) => p.oldPrice);
    const newIn = PRODUCTS.filter((p) => p.badge === 'New');
    const featured = PRODUCTS.filter((p) => p.featured);
    const picks = [];
    [...onSale, ...newIn, ...featured].forEach((p) => {
      if (picks.length < 4 && !picks.includes(p)) picks.push(p);
    });
    wrap.innerHTML = picks
      .map((p) => {
        const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
        return `
          <article class="deal-card">
            <div class="deal-media">
              ${off
                ? `<span class="deal-off">-${off}%</span>`
                : `<span class="deal-off" style="background:linear-gradient(100deg,#B794FF,#8B5CF6);color:#0B0618">${esc(p.badge || 'Popular')}</span>`}
              ${picture(p.image, p.imageAlt)}
            </div>
            <h3 class="deal-name">${esc(p.name)}</h3>
            <div class="deal-prices">
              <span class="now">${money(p.price)}</span>
              ${p.oldPrice ? `<span class="was">${money(p.oldPrice)}</span>` : ''}
            </div>
            <button class="deal-link" type="button" data-goto-product="${p.id}">
              View in shop ${ICONS.arrow}
            </button>
          </article>`;
      })
      .join('');
  }

  /* ---------------- cart rendering ---------------- */
  function renderCart() {
    const itemsEl = $('#cartItems');
    const emptyEl = $('#cartEmpty');
    const footEl = $('#cartFoot');
    if (!itemsEl) return;

    const count = cartCount();
    const subtotal = cartSubtotal();

    const badge = $('#cartCount');
    if (badge) {
      badge.textContent = String(count);
      badge.classList.toggle('is-visible', count > 0);
      badge.setAttribute('aria-label', `${count} item${count === 1 ? '' : 's'} in cart`);
    }
    const meta = $('#cartMeta');
    if (meta) meta.textContent = count === 0 ? '0 items' : `${count} item${count === 1 ? '' : 's'} · ${new Set(state.cart.map((i) => i.id)).size} product${state.cart.length === 1 ? '' : 's'}`;
    const units = $('#sumUnits');
    if (units) units.textContent = String(count);
    const sub = $('#sumSubtotal');
    if (sub) sub.textContent = money(subtotal);

    const hasItems = state.cart.length > 0;
    itemsEl.hidden = !hasItems;
    if (emptyEl) emptyEl.hidden = hasItems;
    if (footEl) footEl.hidden = !hasItems;

    if (!hasItems) {
      itemsEl.innerHTML = '';
      const checkout = $('#checkoutBtn');
      if (checkout) checkout.disabled = true;
      return;
    }
    const checkout = $('#checkoutBtn');
    if (checkout) checkout.disabled = false;

    itemsEl.innerHTML = state.cart
      .map((item) => {
        const p = PRODUCTS.find((x) => x.id === item.id);
        if (!p) return '';
        return `
          <li class="cart-item" data-id="${p.id}">
            <div class="ci-media">${picture(p.image, p.name)}</div>
            <div class="ci-main">
              <span class="ci-name">${esc(p.name)}</span>
              <span class="ci-price">${money(p.price)} each</span>
              <div class="ci-controls">
                <button class="qty-btn" type="button" data-qty="-1" data-id="${p.id}"
                        aria-label="Decrease quantity of ${esc(p.name)}" ${item.qty <= 1 ? 'disabled' : ''}>&minus;</button>
                <span class="qty-val" aria-live="polite">${item.qty}</span>
                <button class="qty-btn" type="button" data-qty="1" data-id="${p.id}"
                        aria-label="Increase quantity of ${esc(p.name)}" ${item.qty >= 99 ? 'disabled' : ''}>+</button>
              </div>
            </div>
            <div class="ci-side">
              <span class="ci-line">${money(p.price * item.qty)}</span>
              <button class="ci-remove" type="button" data-remove="${p.id}" aria-label="Remove ${esc(p.name)} from cart">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M6.5 7l.8 11a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-11"/></svg>
              </button>
            </div>
          </li>`;
      })
      .join('');
  }

  function addToCart(id, buttonEl) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    const existing = state.cart.find((i) => i.id === id);
    if (existing) {
      existing.qty = Math.min(99, existing.qty + 1);
    } else {
      state.cart.push({ id, qty: 1 });
    }
    saveCart();
    renderCart();
    const badge = $('#cartCount');
    if (badge) {
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }
    if (buttonEl) {
      buttonEl.classList.add('is-added');
      buttonEl.innerHTML = ICONS.check.replace('<svg', '<svg style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round"') + 'Added';
      setTimeout(() => {
        buttonEl.classList.remove('is-added');
        buttonEl.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg> Add';
      }, 1500);
    }
    toast(`<strong>${esc(product.name)}</strong> added to cart`, 'cart');
  }

  function changeQty(id, delta) {
    const item = state.cart.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, Math.min(99, item.qty + delta));
    saveCart();
    renderCart();
  }

  function removeItem(id) {
    const product = PRODUCTS.find((p) => p.id === id);
    state.cart = state.cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
    if (product) toast(`<strong>${esc(product.name)}</strong> removed`, 'cart');
  }

  /* ---------------- WhatsApp checkout ---------------- */
  function checkoutMessage() {
    const lines = state.cart
      .map((item) => {
        const p = PRODUCTS.find((x) => x.id === item.id);
        if (!p) return '';
        return `• ${p.name} — Qty: ${item.qty} × ${money(p.price)} = ${money(p.price * item.qty)}`;
      })
      .filter(Boolean);
    const count = cartCount();
    return (
      `Hello ${BUSINESS.name}, I would like to order the following products. Please confirm availability, final prices, and delivery details.\n\n` +
      lines.join('\n') +
      `\n\nItems: ${count}\nSubtotal: ${money(cartSubtotal())}\n\n` +
      `(Prices shown are from your website — please confirm the final total.)`
    );
  }

  function checkoutOnWhatsApp() {
    if (!state.cart.length) {
      toast('Your cart is empty — add a product first', 'cart');
      return;
    }
    const url = waUrl(checkoutMessage());
    window.open(url, '_blank', 'noopener,noreferrer');
    toast('Opening WhatsApp — confirm your order there', 'cart');
  }

  /* ---------------- drawer / menu / modal ---------------- */
  let lastFocused = null;

  function openCart() {
    const drawer = $('#cartDrawer');
    const scrim = $('#scrim');
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.removeAttribute('inert');
    if (scrim) {
      scrim.hidden = false;
      requestAnimationFrame(() => scrim.classList.add('is-open'));
    }
    document.body.classList.add('is-locked');
    const stack = $('#toastStack');
    if (stack) stack.innerHTML = '';   // toasts must not cover the cart UI
    const close = $('#cartCloseBtn');
    if (close) setTimeout(() => close.focus(), 60);
  }

  function closeCart() {
    const drawer = $('#cartDrawer');
    const scrim = $('#scrim');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    if (scrim) {
      scrim.classList.remove('is-open');
      setTimeout(() => { scrim.hidden = true; }, 320);
    }
    document.body.classList.remove('is-locked');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function toggleMenu(force) {
    const btn = $('#menuBtn');
    const menu = $('#mobileMenu');
    if (!btn || !menu) return;
    const open = typeof force === 'boolean' ? force : menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  const LEGAL = {
    privacy: {
      title: 'Privacy Policy',
      body: `
        <h3>Overview</h3>
        <p>EL BASH SMART TECH HUB is a product catalogue website. It does not have user accounts, and it does not collect or store personal information on a server. This page explains the small amount of data your browser keeps while you browse.</p>
        <h3>What this website stores</h3>
        <ul>
          <li>Your shopping cart is saved in your browser's local storage so it survives a page refresh. It stays on your device and can be cleared at any time by emptying the cart or clearing your browser data.</li>
          <li>No account is created and no payment details are collected on this website.</li>
          <li>There are no advertising, analytics or tracking cookies on this website.</li>
          <li>When you tap a WhatsApp or email button, you leave this website and continue in WhatsApp or your email app, where that service's own privacy terms apply.</li>
        </ul>
        <h3>Your choices</h3>
        <p>Because the cart lives only in your own browser, clearing your browser storage removes it. Nothing else about your visit is retained by this website.</p>
        <h3>Contact</h3>
        <p>Questions about privacy can be sent to the business on WhatsApp at <strong>${BUSINESS.phoneDisplay}</strong> or by email at <strong>${BUSINESS.email}</strong>.</p>`
    },
    terms: {
      title: 'Terms &amp; Conditions',
      body: `
        <h3>Sample catalogue</h3>
        <p>Product names, descriptions, and prices shown on this website are <strong>sample data</strong> for presentation. They are not a confirmed quotation.</p>
        <h3>Ordering</h3>
        <ul>
          <li>This website does not process payments and does not complete orders automatically.</li>
          <li>All orders are placed and confirmed through WhatsApp with EL BASH SMART TECH HUB.</li>
          <li>Availability, final pricing and delivery arrangements are agreed in that WhatsApp conversation.</li>
        </ul>
        <h3>Product information</h3>
        <p>Images are illustrative. Actual packaging or model variants may differ between product batches.</p>
        <h3>Questions</h3>
        <p>Message <strong>${BUSINESS.phoneDisplay}</strong> on WhatsApp for clarification before ordering.</p>`
    }
  };

  function openLegal(kind) {
    const data = LEGAL[kind] || LEGAL.privacy;
    const modal = $('#legalModal');
    if (!modal) return;
    lastFocused = document.activeElement;
    $('#legalTitle').innerHTML = data.title;
    $('#legalBody').innerHTML = data.body;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.removeAttribute('inert');
    document.body.classList.add('is-locked');
    setTimeout(() => $('#legalClose').focus(), 60);
  }

  function closeLegal() {
    const modal = $('#legalModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('inert', '');
    document.body.classList.remove('is-locked');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  /* ---------------- contact placeholders ---------------- */
  function renderContact() {
    $$('[data-wa-link]').forEach((el) => {
      el.setAttribute('href', waUrl(generalMessage()));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
    $$('[data-phone-display]').forEach((el) => (el.textContent = BUSINESS.phoneDisplay));

    const emailEl = $('#contactEmail');
    if (emailEl && BUSINESS.email) emailEl.textContent = BUSINESS.email;
    const addressEl = $('#contactAddress');
    if (addressEl && BUSINESS.address) addressEl.textContent = BUSINESS.address;

    const footerEmail = $('#footerEmail');
    if (footerEmail && BUSINESS.email) {
      const link = document.createElement('a');
      link.href = 'mailto:' + BUSINESS.email;
      link.textContent = BUSINESS.email;
      footerEmail.replaceWith(link);
    }
    const footerAddress = $('#footerAddress');
    if (footerAddress && BUSINESS.address) {
      footerAddress.textContent = BUSINESS.address;
      footerAddress.classList.remove('placeholder-text');
    }
    if (footerAddress && !BUSINESS.address) {
      footerAddress.textContent = 'Shop address — to be added';
    }

    // Only channels that actually exist are rendered — no "add link" placeholders.
    const socials = [
      { key: 'instagram', label: 'Instagram' },
      { key: 'facebook', label: 'Facebook' },
      { key: 'tiktok', label: 'TikTok' },
      { key: 'x', label: 'X' }
    ];
    const parts = socials
      .filter((s) => BUSINESS.socials && BUSINESS.socials[s.key])
      .map((s) => `<a class="social-link" href="${esc(BUSINESS.socials[s.key])}" target="_blank" rel="noopener noreferrer">${s.label}</a>`);
    parts.push(`<a class="social-link" href="${esc(waUrl(generalMessage()))}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`);
    if (BUSINESS.email) {
      parts.push(`<a class="social-link" href="mailto:${esc(BUSINESS.email)}">Email</a>`);
    }
    const markup = parts.join('');
    const socialRow = $('#socialRow');
    if (socialRow) socialRow.innerHTML = markup;
    const footerSocial = $('#footerSocial');
    if (footerSocial) footerSocial.innerHTML = markup;
  }

  /* ---------------- reveals + header state ----------------
     Geometry based (not IntersectionObserver) so a section can never stay
     invisible when it is skipped by an anchor jump or fast scrolling:
     anything at, above, or just below the viewport is revealed. */
  let revealQueued = false;
  function revealVisible() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    $$('.reveal:not(.is-in)').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh + 260 && rect.bottom > -600) el.classList.add('is-in');
    });
  }
  function queueReveal() {
    if (revealQueued) return;
    revealQueued = true;
    requestAnimationFrame(() => {
      revealQueued = false;
      revealVisible();
    });
  }
  function observeReveals() {
    revealVisible();
    // belt-and-braces: never leave content hidden if something goes wrong
    setTimeout(revealVisible, 1200);
  }

  function syncHeader() {
    const header = $('#siteHeader');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    // active nav link by section in view
    const sections = ['home', 'products', 'categories', 'deals', 'contact'];
    let current = 'home';
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 140) current = id;
    });
    $$('.nav-link').forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ---------------- events ---------------- */
  function wireEvents() {
    /* cart */
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        e.preventDefault();
        addToCart(addBtn.dataset.add, addBtn);
        return;
      }
      const qtyBtn = e.target.closest('[data-qty]');
      if (qtyBtn) {
        changeQty(qtyBtn.dataset.id, Number(qtyBtn.dataset.qty));
        return;
      }
      const removeBtn = e.target.closest('[data-remove]');
      if (removeBtn) {
        removeItem(removeBtn.dataset.remove);
        return;
      }
      const catCard = e.target.closest('[data-category]');
      if (catCard) {
        setCategory(catCard.dataset.category);
        return;
      }
      const filterBtn = e.target.closest('[data-filter]');
      if (filterBtn) {
        e.preventDefault();
        toggleMenu(false);
        setCategory(filterBtn.dataset.filter);
        return;
      }
      const goProduct = e.target.closest('[data-goto-product]');
      if (goProduct) {
        const id = goProduct.dataset.gotoProduct;
        const product = PRODUCTS.find((p) => p.id === id);
        if (product) {
          state.category = product.category;
          state.query = '';
          $('#shopSearch').value = '';
          renderProducts();
        }
        const target = document.querySelector(`.product-card[data-id="${id}"]`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.animate(
            [{ boxShadow: '0 0 0 0 rgba(61,220,255,0)' }, { boxShadow: '0 0 0 3px rgba(61,220,255,0.55)' }, { boxShadow: '0 0 0 0 rgba(61,220,255,0)' }],
            { duration: 1600, easing: 'ease-out' }
          );
        }
        return;
      }
      const legal = e.target.closest('[data-legal]');
      if (legal) {
        e.preventDefault();
        toggleMenu(false);
        openLegal(legal.dataset.legal);
        return;
      }
    });

    /* open / close cart */
    $('#cartOpenBtn')?.addEventListener('click', openCart);
    $('#cartCloseBtn')?.addEventListener('click', closeCart);
    $('#keepShopping')?.addEventListener('click', closeCart);
    $('#continueShopping')?.addEventListener('click', () => { closeCart(); setCategory('all'); });
    $('#scrim')?.addEventListener('click', closeCart);
    $('#checkoutBtn')?.addEventListener('click', checkoutOnWhatsApp);

    /* legal modal */
    $('#legalClose')?.addEventListener('click', closeLegal);
    $('#legalDone')?.addEventListener('click', closeLegal);
    $('#legalModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'legalModal') closeLegal();
    });

    /* mobile menu */
    $('#menuBtn')?.addEventListener('click', () => toggleMenu());
    $$('#mobileMenu a[href^="#"]').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

    /* search inputs */
    const syncSearch = (value) => {
      state.query = value;
      const targets = ['#shopSearch', '#headerSearch', '#mobileSearch'];
      targets.forEach((sel) => {
        const el = $(sel);
        if (el && el.value !== value) el.value = value;
      });
      if ($('#clearSearch')) $('#clearSearch').hidden = value.length === 0;
      renderProducts();
    };

    ['#headerSearch', '#mobileSearch'].forEach((sel) => {
      const el = $(sel);
      if (!el) return;
      el.addEventListener('input', (e) => syncSearch(e.target.value));
      el.addEventListener('focus', () => {
        // bring the shopper to the grid so they see live results
        const products = $('#products');
        if (products) products.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      const form = el.closest('form');
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        toggleMenu(false);
        const products = $('#products');
        if (products) products.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    $('#shopSearch')?.addEventListener('input', (e) => syncSearch(e.target.value));
    $('#clearSearch')?.addEventListener('click', () => {
      syncSearch('');
      $('#shopSearch')?.focus();
    });

    /* sort + reset */
    $('#sortSelect')?.addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderProducts();
    });
    $('#resetFilters')?.addEventListener('click', () => resetFilters(true));
    $('#emptyReset')?.addEventListener('click', () => resetFilters(false));
    $('#catResetBtn')?.addEventListener('click', () => setCategory('all'));
    $('#deals')?.querySelector('[data-deals-shop]')?.addEventListener('click', () => resetFilters(false));

    /* keyboard */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if ($('#legalModal')?.classList.contains('is-open')) closeLegal();
        else if ($('#cartDrawer')?.classList.contains('is-open')) closeCart();
        else if (!$('#mobileMenu')?.hidden) toggleMenu(false);
      }
      // basic focus trap inside cart drawer
      if (e.key === 'Tab' && $('#cartDrawer')?.classList.contains('is-open')) {
        const focusables = $$('#cartDrawer button:not([disabled]), #cartDrawer a[href]');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    /* close mobile menu when resizing up */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) toggleMenu(false);
    });

    window.addEventListener('scroll', () => {
      syncHeader();
      queueReveal();
    }, { passive: true });
    window.addEventListener('resize', queueReveal);
    window.addEventListener('hashchange', () => setTimeout(revealVisible, 60));
    window.addEventListener('load', revealVisible);
  }

  /* ---------------- init ---------------- */
  function init() {
    renderCategories();
    renderFilterChips();
    renderFooterCategories();
    renderDeals();
    renderContact();
    renderRails();
    renderProducts();
    renderCart();
    wireEvents();
    observeReveals();
    syncHeader();
    $$('.rail-track[data-rail]').forEach(syncRailNav);

    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    // expose a tiny debug hook for manual verification
    window.BASH = { state, addToCart, checkoutMessage, waUrl, money };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
