'use strict';
/* =========================================================
   VoltHub – app.js
   Sections: 1 Settings · 2 Fallback data · 3 Helpers · 4 State
   5 Rendering · 6 Cart · 7 Drawer/Modal · 8 Checkout · 9 Events · 10 Start
   ========================================================= */

/* ---------- 1. SETTINGS (easy to edit) ---------- */
const TAX_RATE = 0.08;      // 8% tax. Change to 0.05 for 5%, etc.
const CURRENCY = '$';       // Currency symbol shown on prices
const MAX_QTY = 10;         // Max quantity of one item per order
// Category name → [emoji icon, color hue 0-360]
const CATS = {
  'Smartphones':[ '📱',215], 'Laptops':['💻',250], 'Headphones':['🎧',280], 'TVs':['📺',190],
  'Cameras':['📷',330], 'Smartwatches':['⌚',160], 'Gaming':['🎮',265], 'Accessories':['🔌',40],
  'Home Appliances':['🏠',20]
};

/* ---------- 2. BUILT-IN PRODUCT LIST (used if products.json can't load) ----------
   Each line: id;name;category;brand;price;oldPrice(0=none);rating;reviews;inStock(1/0);description;spec1|spec2 */
const RAW = `
1;Nova X1 Pro 5G;Smartphones;Nexa;899;999;4.7;1240;1;Flagship phone with a stunning OLED screen and 200MP camera.;6.7" 120Hz OLED|5000mAh battery
2;Nova X1 Lite;Smartphones;Nexa;499;0;4.4;860;1;Slim everyday phone with all-day battery life.;6.3" AMOLED|128GB storage
3;Aero Fold Z;Smartphones;Aurora;1599;1799;4.6;310;1;Foldable phone with a tablet-size inner display.;7.6" foldable screen|256GB storage
4;Zen A5;Smartphones;Zenith;249;299;4.2;2100;0;Budget phone with a big battery and clean software.;6.5" LCD|5000mAh battery
5;AeroBook Air 13;Laptops;Aurora;1099;0;4.8;970;1;Ultralight laptop with 18-hour battery life.;13.6" display|16GB RAM, 512GB SSD
6;Voltix Pro 16;Laptops;Voltix;1899;2099;4.7;540;1;Creator laptop with a bright mini-LED screen.;16" mini-LED|32GB RAM, 1TB SSD
7;Zenith Student 14;Laptops;Zenith;549;649;4.1;1580;1;Affordable laptop for school and home.;14" Full HD|8GB RAM, 256GB SSD
8;Voltix Gamer X;Laptops;Voltix;1499;1699;4.5;420;0;High-refresh gaming laptop with dedicated graphics.;15.6" 165Hz|Dedicated GPU
9;Lumio Studio ANC;Headphones;Lumio;349;399;4.8;2300;1;Over-ear headphones with studio sound and noise cancelling.;40hr battery|Active noise cancelling
10;Lumio Buds 2;Headphones;Lumio;149;0;4.5;3400;1;Compact wireless earbuds with a secure fit.;8hr battery (24hr with case)|IPX4 water resistant
11;Pulse Sport;Headphones;Nexa;89;119;4.3;1900;1;Sweat-proof neckband earphones for workouts.;20hr battery|IPX5 rated
12;Zen Bass Pro;Headphones;Zenith;59;0;4.0;760;1;Wired headphones with punchy bass.;3.5mm cable|Foldable design
13;Aurora QLED 55;TVs;Aurora;799;999;4.6;880;1;55" 4K QLED smart TV with vivid colors.;4K 120Hz|Built-in streaming apps
14;Nexa OLED 65;TVs;Nexa;1799;2099;4.9;450;1;65" OLED with perfect blacks for movie nights.;4K OLED|Dolby Vision & Atmos
15;Zenith Smart 43;TVs;Zenith;329;0;4.2;1320;1;Compact 43" 4K smart TV for any room.;4K 60Hz|3 HDMI ports
16;Lumio Mirrorless M5;Cameras;Lumio;1299;1499;4.7;380;1;24MP mirrorless camera with fast autofocus.;24MP sensor|4K video
17;Pocket Cam 4K;Cameras;Voltix;349;0;4.4;640;1;Pocket-size waterproof action camera.;4K 60fps|Waterproof to 10m
18;SnapNow Instant;Cameras;Zenith;99;129;4.1;2200;0;Instant camera that prints photos on the spot.;Instant prints|Built-in flash
19;Aurora Watch S;Smartwatches;Aurora;399;0;4.6;1450;1;Smartwatch with health tracking and GPS.;Built-in GPS|7-day battery
20;Nexa Fit Band 7;Smartwatches;Nexa;59;79;4.3;4100;1;Light fitness band with sleep tracking.;14-day battery|AMOLED display
21;Voltix Trek Ultra;Smartwatches;Voltix;549;649;4.5;290;1;Rugged outdoor watch with dual-band GPS.;Titanium case|Dual-band GPS
22;Aero Console X;Gaming;Aurora;499;0;4.8;3200;1;Next-gen console for smooth 4K gaming.;1TB SSD|4K at 120fps
23;Pulse Controller Pro;Gaming;Nexa;69;79;4.4;1750;1;Wireless controller with back paddles.;Bluetooth|40hr battery
24;Voltix Handheld;Gaming;Voltix;399;449;4.3;520;1;Handheld gaming PC with a 7" screen.;7" 120Hz display|512GB SSD
25;Zen Fast Charger 65W;Accessories;Zenith;39;0;4.5;2600;1;Compact GaN charger for phone and laptop.;65W GaN|2 USB-C ports
26;Nexa Power Bank 20K;Accessories;Nexa;49;59;4.4;3100;1;20,000mAh power bank with fast charging.;20000mAh|22.5W output
27;Lumio Mech Keyboard;Accessories;Lumio;119;0;4.6;940;1;Wireless mechanical keyboard with hot-swap switches.;Hot-swap switches|Pairs with 3 devices
28;Voltix Ergo Mouse;Accessories;Voltix;59;0;4.3;1100;1;Ergonomic wireless mouse for all-day comfort.;4000 DPI|90-day battery
29;Aurora Robot Vacuum;Home Appliances;Aurora;449;549;4.5;780;1;Robot vacuum with room mapping and mopping.;5000Pa suction|Auto-empty dock
30;Zenith Air Fryer 5L;Home Appliances;Zenith;99;129;4.6;2900;1;5-litre air fryer for crispy meals with less oil.;1700W|8 cooking presets
31;Nexa Air Purifier;Home Appliances;Nexa;179;0;4.4;650;1;HEPA purifier for rooms up to 40 square meters.;HEPA H13 filter|Quiet 24dB mode
32;Lumio Smart Speaker;Home Appliances;Lumio;79;99;4.2;1800;1;Voice-controlled speaker with room-filling sound.;360° sound|Wi-Fi + Bluetooth
`;
const FALLBACK = RAW.trim().split('\n').map(line => {
  const c = line.split(';');
  return { id:+c[0], name:c[1], category:c[2], brand:c[3], price:+c[4], oldPrice:+c[5], rating:+c[6],
           reviews:+c[7], inStock:c[8] === '1', description:c[9], specs:c[10].split('|') };
});

/* ---------- 3. HELPERS ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => CURRENCY + Number(n).toFixed(2);                 // always 2 decimals
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked: ignore */ } };

/* ---------- 4. STATE ---------- */
const state = {
  products: [], maxPrice: 2000,
  cart: load('vh_cart', {}),            // { productId: quantity }
  wish: load('vh_wish', []),            // [productId, ...]
  f: { q:'', cat:'all', brand:'all', max:2000, rating:0, sort:'popular' },
  drawer: 'cart'
};
if (!state.cart || typeof state.cart !== 'object' || Array.isArray(state.cart)) state.cart = {};
if (!Array.isArray(state.wish)) state.wish = [];
const byId = id => state.products.find(p => p.id === Number(id));

/* ---------- 5. RENDERING ---------- */
const hue = p => (CATS[p.category] || ['📦', 220])[1];
const icon = p => (CATS[p.category] || ['📦'])[0];

// Product picture: colored emoji tile. If p.image is set it is shown on top (and removed if it fails to load).
const tile = p => `<div class="tile" style="--h:${hue(p)}">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ''}<span aria-hidden="true">${icon(p)}</span></div>`;
const stars = r => { const n = Math.round(r); return `<span class="stars" aria-label="Rated ${r} out of 5">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span> <small class="muted">${Number(r).toFixed(1)}</small>`; };
const priceHtml = p => {
  const has = p.oldPrice && p.oldPrice > p.price;
  return `<span class="price">${money(p.price)}</span>` + (has ? `<s>${money(p.oldPrice)}</s><span class="off">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : '');
};

// One product card
const card = p => `
<article class="card">
  <button class="heart ${state.wish.includes(p.id) ? 'on' : ''}" data-act="wish" data-id="${p.id}" aria-label="Toggle wishlist for ${esc(p.name)}">${state.wish.includes(p.id) ? '♥' : '♡'}</button>
  <div class="clickable" data-act="view" data-id="${p.id}" role="button" tabindex="0" aria-label="View details for ${esc(p.name)}">${tile(p)}</div>
  <div class="card-body">
    <small class="muted">${esc(p.brand)} · ${esc(p.category)}</small>
    <h3>${esc(p.name)}</h3>
    <div>${stars(p.rating)}</div>
    <div class="prices">${priceHtml(p)}</div>
    <button class="btn" data-act="add" data-id="${p.id}" ${p.inStock ? '' : 'disabled'} aria-label="Add ${esc(p.name)} to cart">${p.inStock ? 'Add to Cart' : 'Out of Stock'}</button>
  </div>
</article>`;

function renderHome() {
  // Category grid with product counts
  $('#catGrid').innerHTML = Object.keys(CATS).map(c => {
    const n = state.products.filter(p => p.category === c).length;
    return `<button class="cat" data-act="cat" data-cat="${esc(c)}" aria-label="Browse ${esc(c)}"><span class="cat-i">${CATS[c][0]}</span><strong>${esc(c)}</strong><small>${n} products</small></button>`;
  }).join('');
  // Featured = most reviewed, 4 items
  $('#featuredGrid').innerHTML = [...state.products].sort((a, b) => b.reviews - a.reviews).slice(0, 4).map(card).join('');
  // Deals = biggest % discount, 4 items
  const disc = p => p.oldPrice > p.price ? 1 - p.price / p.oldPrice : 0;
  const deals = state.products.filter(p => disc(p) > 0).sort((a, b) => disc(b) - disc(a)).slice(0, 4);
  $('#dealsGrid').innerHTML = deals.length ? deals.map(card).join('') : '<p class="empty">No deals right now. Check back soon!</p>';
}

function filtered() {
  const f = state.f;
  const list = state.products.filter(p =>
    (f.cat === 'all' || p.category === f.cat) &&
    (f.brand === 'all' || p.brand === f.brand) &&
    p.price <= f.max && p.rating >= f.rating &&
    (!f.q || `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase().includes(f.q)));
  const sorters = { low:(a, b) => a.price - b.price, high:(a, b) => b.price - a.price, popular:(a, b) => b.reviews - a.reviews, newest:(a, b) => b.id - a.id };
  return list.sort(sorters[f.sort] || sorters.popular);
}

function renderGrid() {
  const list = filtered();
  $('#shopGrid').innerHTML = list.length ? list.map(card).join('') : '<p class="empty">😕 No products match your filters. Try resetting them.</p>';
  $('#resultCount').textContent = `${list.length} product${list.length === 1 ? '' : 's'} found`;
  $('#fPriceVal').textContent = money(state.f.max).replace('.00', '');
}

function setupFilters() {
  state.maxPrice = Math.ceil(Math.max(...state.products.map(p => p.price)) / 10) * 10;
  const brands = [...new Set(state.products.map(p => p.brand))].sort();
  const cats = [...new Set(state.products.map(p => p.category))];
  $('#fCat').innerHTML = '<option value="all">All categories</option>' + cats.map(c => `<option>${esc(c)}</option>`).join('');
  $('#fBrand').innerHTML = '<option value="all">All brands</option>' + brands.map(b => `<option>${esc(b)}</option>`).join('');
  $('#fPrice').max = state.maxPrice;
  resetFilters(false);
}

function syncControls() {
  const f = state.f;
  $('#fCat').value = f.cat; $('#fBrand').value = f.brand; $('#fRating').value = String(f.rating);
  $('#fSort').value = f.sort; $('#fPrice').value = f.max; $('#search').value = f.q;
}
function resetFilters(render = true) {
  state.f = { q:'', cat:'all', brand:'all', max:state.maxPrice, rating:0, sort:'popular' };
  syncControls();
  if (render) renderGrid();
}

// Update heart icons / wishlist labels everywhere without re-rendering
function paintWish() {
  $$('[data-act="wish"][data-id]').forEach(b => {
    const on = state.wish.includes(Number(b.dataset.id));
    b.classList.toggle('on', on);
    if (b.classList.contains('heart')) b.textContent = on ? '♥' : '♡';
    else if (b.dataset.lbl) b.textContent = on ? '♥ In Wishlist' : '♡ Add to Wishlist';
  });
}
function updateBadges() {
  $('#cartCount').textContent = cartItems().reduce((s, x) => s + x.q, 0);
  $('#wishCount').textContent = state.wish.length;
}

/* ---------- 6. CART & WISHLIST LOGIC ---------- */
const cartItems = () => Object.entries(state.cart).map(([id, q]) => ({ p: byId(id), q })).filter(x => x.p);
function totals() {
  const sub = cartItems().reduce((s, x) => s + x.p.price * x.q, 0);
  const tax = sub * TAX_RATE;
  return { sub, tax, total: sub + tax };
}
function persist() { save('vh_cart', state.cart); save('vh_wish', state.wish); updateBadges(); }

function addToCart(id, qty = 1) {
  const p = byId(id);
  if (!p) return toast('Product not found.', 'error');
  if (!p.inStock) return toast('Sorry, this item is out of stock.', 'error');
  const cur = state.cart[p.id] || 0;
  state.cart[p.id] = Math.min(cur + qty, MAX_QTY);
  if (cur + qty > MAX_QTY) toast(`Maximum ${MAX_QTY} per order.`, 'error');
  else toast(`${p.name} added to cart 🛒`, 'success');
  persist();
  if ($('#drawer').classList.contains('open')) renderDrawer();
}
function changeQty(id, d) {
  const q = (state.cart[id] || 0) + d;
  if (q <= 0) delete state.cart[id];
  else if (q > MAX_QTY) toast(`Maximum ${MAX_QTY} per order.`, 'error');
  else state.cart[id] = q;
  persist(); renderDrawer();
}
function toggleWish(id) {
  id = Number(id);
  const i = state.wish.indexOf(id);
  if (i > -1) { state.wish.splice(i, 1); toast('Removed from wishlist'); }
  else { state.wish.push(id); toast('Added to wishlist ♥', 'success'); }
  persist(); paintWish();
  if ($('#drawer').classList.contains('open') && state.drawer === 'wish') renderDrawer();
}

/* ---------- 7. DRAWER, MODAL, TOASTS ---------- */
function renderDrawer() {
  const body = $('#drawerBody'), foot = $('#drawerFoot');
  if (state.drawer === 'cart') {
    $('#drawerTitle').textContent = 'Your Cart';
    const items = cartItems();
    if (!items.length) { body.innerHTML = '<p class="empty">Your cart is empty 🛒<br>Add something you love!</p>'; foot.innerHTML = ''; return; }
    body.innerHTML = items.map(({ p, q }) => `
      <div class="line">${tile(p)}
        <div><strong>${esc(p.name)}</strong><div class="muted">${money(p.price)} each</div>
          <div class="qty sm"><button data-act="dec" data-id="${p.id}" aria-label="Decrease quantity of ${esc(p.name)}">−</button><span>${q}</span><button data-act="inc" data-id="${p.id}" aria-label="Increase quantity of ${esc(p.name)}">+</button></div></div>
        <div class="line-r"><strong>${money(p.price * q)}</strong><button class="link" data-act="remove" data-id="${p.id}" aria-label="Remove ${esc(p.name)} from cart">Remove</button></div>
      </div>`).join('');
    const t = totals();
    foot.innerHTML = `<div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div>
      <div class="row"><span>Tax (${(TAX_RATE * 100).toFixed(0)}%)</span><span>${money(t.tax)}</span></div>
      <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
      <button class="btn block" data-act="checkout" aria-label="Proceed to checkout">Checkout</button>`;
  } else {
    $('#drawerTitle').textContent = 'Your Wishlist';
    const items = state.wish.map(byId).filter(Boolean);
    foot.innerHTML = '';
    body.innerHTML = items.length ? items.map(p => `
      <div class="line">${tile(p)}
        <div><strong>${esc(p.name)}</strong><div class="prices">${priceHtml(p)}</div>
          <button class="btn" style="padding:6px 12px;font-size:.8rem" data-act="add" data-id="${p.id}" ${p.inStock ? '' : 'disabled'} aria-label="Add ${esc(p.name)} to cart">${p.inStock ? 'Add to Cart' : 'Out of Stock'}</button></div>
        <div class="line-r"><button class="link" data-act="wish" data-id="${p.id}" aria-label="Remove ${esc(p.name)} from wishlist">Remove</button></div>
      </div>`).join('') : '<p class="empty">Your wishlist is empty ♡<br>Tap the heart on any product.</p>';
  }
}
function openDrawer(mode) {
  closeAll();
  state.drawer = mode; renderDrawer();
  $('#drawer').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); $('#backdrop').classList.add('open');
}
function openModal(html) {
  closeAll();
  $('#modalBody').innerHTML = html;
  $('#modal').classList.add('open'); $('#modal').setAttribute('aria-hidden', 'false');
  $('.modal-box').scrollTop = 0;
}
function closeAll() {
  $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true');
  $('#modal').classList.remove('open'); $('#modal').setAttribute('aria-hidden', 'true');
  $('#backdrop').classList.remove('open');
}
function toast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = 'toast ' + type; t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// Product detail pop-up
function openDetail(id) {
  const p = byId(id); if (!p) return;
  openModal(`<div class="detail">
    <div>${tile(p)}</div>
    <div>
      <small class="muted">${esc(p.brand)} · ${esc(p.category)}</small>
      <h2>${esc(p.name)}</h2>
      <div>${stars(p.rating)} <small class="muted">(${Number(p.reviews).toLocaleString()} reviews)</small></div>
      <div class="prices big">${priceHtml(p)}</div>
      <p>${esc(p.description)}</p>
      <h4>Specifications</h4>
      <ul class="specs">${(p.specs || []).map(s => `<li>${esc(s)}</li>`).join('')}<li>Brand: ${esc(p.brand)}</li></ul>
      <p class="stock ${p.inStock ? 'ok' : 'no'}">${p.inStock ? '● In stock' : '● Out of stock'}</p>
      <div class="qty-row">
        <div class="qty"><button data-act="dq" data-d="-1" aria-label="Decrease quantity">−</button><span id="dq">1</span><button data-act="dq" data-d="1" aria-label="Increase quantity">+</button></div>
        <button class="btn" data-act="dadd" data-id="${p.id}" ${p.inStock ? '' : 'disabled'} aria-label="Add ${esc(p.name)} to cart">Add to Cart</button>
        <button class="btn ghost" data-act="wish" data-id="${p.id}" data-lbl="1" aria-label="Toggle wishlist for ${esc(p.name)}"></button>
      </div>
    </div></div>`);
  paintWish();
}

/* ---------- 8. CHECKOUT ---------- */
const field = (name, label, type, ph, extra = '') =>
  `<label class="field">${label}<input id="f-${name}" name="${name}" type="${type}" placeholder="${ph}" ${extra} aria-describedby="err-${name}"><small class="err" id="err-${name}"></small></label>`;

function openCheckout() {
  if (!cartItems().length) return toast('Your cart is empty.', 'error');
  const t = totals();
  openModal(`<h2>Checkout</h2>
    <form class="form" id="coForm" novalidate>
      ${field('name', 'Full name', 'text', 'Jane Doe', 'autocomplete="name"')}
      ${field('email', 'Email', 'email', 'jane@example.com', 'autocomplete="email"')}
      ${field('address', 'Street address', 'text', '123 Main Street', 'autocomplete="street-address"')}
      <div class="two">${field('city', 'City', 'text', 'Springfield')}${field('zip', 'Postal code', 'text', '12345')}</div>
      <label class="field">Payment method (demo only)
        <select id="f-payment" name="payment" aria-describedby="err-payment">
          <option value="">Select…</option><option>Credit / Debit card (demo)</option><option>Cash on delivery</option><option>UPI / Wallet (demo)</option>
        </select><small class="err" id="err-payment"></small></label>
      <div class="sum">
        <div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div>
        <div class="row"><span>Tax</span><span>${money(t.tax)}</span></div>
        <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
      </div>
      <button class="btn" type="submit" aria-label="Place order">Place Order</button>
    </form>`);
}

// Validation rules: return true if OK, or an error message
const RULES = {
  name:    v => v.trim().length >= 2 || 'Please enter your full name.',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email like name@example.com.',
  address: v => v.trim().length >= 8 || 'Please enter your full street address.',
  city:    v => v.trim().length >= 2 || 'Please enter your city.',
  zip:     v => /^[A-Za-z0-9 -]{3,10}$/.test(v.trim()) || 'Enter a valid postal code.',
  payment: v => !!v || 'Please choose a payment method.'
};
function submitOrder(form) {
  let ok = true;
  Object.keys(RULES).forEach(k => {
    const input = form.elements[k], res = RULES[k](input.value);
    $('#err-' + k).textContent = res === true ? '' : res;
    input.classList.toggle('invalid', res !== true);
    if (res !== true) ok = false;
  });
  if (!ok) return toast('Please fix the highlighted fields.', 'error');
  const t = totals(), first = form.elements.name.value.trim().split(' ')[0], email = form.elements.email.value.trim();
  const num = 'VH-' + Date.now().toString().slice(-8);
  state.cart = {}; persist();                       // clear the cart
  $('#modalBody').innerHTML = `<div class="done"><div class="check">✓</div>
    <h2>Thank you, ${esc(first)}!</h2>
    <p>Your order <strong>${num}</strong> is confirmed.</p>
    <p>A confirmation would be sent to <strong>${esc(email)}</strong>.</p>
    <p>Order total: <strong>${money(t.total)}</strong><br><small class="muted">(Demo store: no real payment was taken.)</small></p>
    <button class="btn" data-act="close" aria-label="Continue shopping">Continue Shopping</button></div>`;
}

/* ---------- 9. EVENTS ---------- */
function scrollToShop() { $('#shop').scrollIntoView({ behavior: 'smooth' }); }

document.addEventListener('click', e => {
  if (e.target.id === 'modal') return closeAll();          // click outside the dialog
  const t = e.target.closest('[data-act]'); if (!t) return;
  const id = t.dataset.id;
  switch (t.dataset.act) {
    case 'add': addToCart(id); break;
    case 'wish': toggleWish(id); break;
    case 'view': openDetail(id); break;
    case 'inc': changeQty(id, 1); break;
    case 'dec': changeQty(id, -1); break;
    case 'remove': delete state.cart[id]; persist(); renderDrawer(); toast('Item removed'); break;
    case 'openCart': openDrawer('cart'); break;
    case 'openWish': openDrawer('wish'); break;
    case 'checkout': openCheckout(); break;
    case 'close': closeAll(); break;
    case 'reset': resetFilters(); break;
    case 'cat': state.f.cat = t.dataset.cat; syncControls(); renderGrid(); scrollToShop(); break;
    case 'dq': { const el = $('#dq'); el.textContent = Math.min(MAX_QTY, Math.max(1, Number(el.textContent) + Number(t.dataset.d))); break; }
    case 'dadd': addToCart(id, Number($('#dq').textContent)); break;
    case 'theme': setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); break;
    case 'menu': $('#nav').classList.toggle('open'); break;
  }
});
// Close the mobile menu after tapping a link
$('#nav').addEventListener('click', e => { if (e.target.tagName === 'A') $('#nav').classList.remove('open'); });
// Keyboard: Enter on a product image opens details; Esc closes panels
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAll();
  if (e.key === 'Enter' && e.target.matches('[data-act="view"]')) openDetail(e.target.dataset.id);
});
// Forms (checkout + newsletter)
document.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id === 'coForm') submitOrder(e.target);
  if (e.target.id === 'nlForm') {
    const v = $('#nlEmail').value.trim(), msg = $('#nlMsg');
    if (RULES.email(v) !== true) { msg.textContent = 'Please enter a valid email address.'; return; }
    msg.textContent = '🎉 Thanks for subscribing!'; $('#nlEmail').value = '';
  }
});
// Filters + live search
$('#fCat').addEventListener('change', e => { state.f.cat = e.target.value; renderGrid(); });
$('#fBrand').addEventListener('change', e => { state.f.brand = e.target.value; renderGrid(); });
$('#fRating').addEventListener('change', e => { state.f.rating = Number(e.target.value); renderGrid(); });
$('#fSort').addEventListener('change', e => { state.f.sort = e.target.value; renderGrid(); });
$('#fPrice').addEventListener('input', e => { state.f.max = Number(e.target.value); renderGrid(); });
$('#search').addEventListener('input', e => {
  state.f.q = e.target.value.trim().toLowerCase(); renderGrid();
  if (state.f.q && $('#shop').getBoundingClientRect().top > window.innerHeight * 0.5) scrollToShop();
});

function setTheme(t) {
  document.documentElement.dataset.theme = t; save('vh_theme', t);
  $('#themeBtn').textContent = t === 'dark' ? '☀️' : '🌙';
}

/* ---------- 10. START ---------- */
async function init() {
  setTheme(load('vh_theme', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  updateBadges();
  try {
    const res = await fetch('products.json', { cache: 'no-cache' });       // relative path, works on any static host
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) throw new Error('products.json is empty or invalid');
    state.products = data;
  } catch (err) {
    // Happens when opening index.html directly from a folder (file://). Use the built-in list so the page is never blank.
    console.warn('Using built-in product list:', err.message);
    state.products = FALLBACK;
  }
  // Remove saved cart/wishlist entries for products that no longer exist
  Object.keys(state.cart).forEach(id => { if (!byId(id)) delete state.cart[id]; });
  state.wish = state.wish.filter(id => byId(id));
  persist();
  setupFilters(); renderHome(); renderGrid(); updateBadges();
}
init();
