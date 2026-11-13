/* Queen16 Beauty Empire storefront: search, filters, cart, WhatsApp checkout. */
(function () {
  const S = window.Q16;
  const esc = S.esc;
  const $ = (id) => document.getElementById(id);
  let settings = S.DEFAULT_SETTINGS;
  let cats = [];
  let subs = S.subs();
  let products = [];
  let curCat = "all";
  let curSub = "all";
  let query = "";
  let sort = "featured";
  let wishOnly = false;
  let cart = [];
  let wish = [];
  try { cart = JSON.parse(localStorage.getItem("q16_cart")) || []; } catch (e) {}
  try { wish = JSON.parse(localStorage.getItem("q16_wish")) || []; } catch (e) {}
  let cust = {};
  try { cust = JSON.parse(localStorage.getItem("q16_customer")) || {}; } catch (e) {}

  const waNum = () => String(settings.whatsapp || "256700888511").replace(/\D/g, "");
  const waLink = (t) => "https://wa.me/" + waNum() + "?text=" + encodeURIComponent(t);
  const imgOf = (p) => (p.images && p.images[0]) || settings.hero_image || "";
  const catName = (slug) => ((cats.find((c) => c.slug === slug) || {}).name) || "";
  const subName = (slug) => ((subs.find((s) => s.slug === slug) || {}).name) || "";
  const outOfStock = (p) => p.stock !== null && p.stock !== undefined && p.stock !== "" && Number(p.stock) <= 0;
  const lowStock = (p) => !outOfStock(p) && p.stock !== null && p.stock !== undefined && p.stock !== "" && Number(p.stock) <= 3;

  function priceHtml(p) {
    const n = S.ugx(p.price);
    if (!n) return "Price on request";
    return (p.show_old_price && p.old_price ? '<s>' + S.ugx(p.old_price) + "</s> " : "") + n;
  }
  function toast(t) {
    const el = $("toast");
    el.textContent = t;
    el.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove("show"), 1600);
  }
  function lock(on) { document.body.classList.toggle("lock", !!on); }

  function applySettings() {
    document.querySelectorAll("[data-s]").forEach((el) => {
      const v = settings[el.dataset.s];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-wa]").forEach((a) => {
      a.href = waLink(a.dataset.wa);
    });
    const hero = $("heroImg");
    if (hero && settings.hero_image) hero.src = settings.hero_image;
    const phone = $("phoneLink");
    if (phone) {
      phone.textContent = settings.phone_display || "";
      phone.href = "tel:+" + waNum();
    }
    const an = $("announce");
    if (an) {
      an.hidden = !settings.announcement;
      an.textContent = settings.announcement || "";
    }
    $("whyGrid").innerHTML = (settings.why || []).map((w, i) =>
      '<article class="why-item"><span>0' + (i + 1) + "</span><h3>" + esc(w.t) + "</h3><p>" + esc(w.d) + "</p></article>"
    ).join("");
    $("catTiles").innerHTML = cats.map((c) =>
      '<button class="tile" type="button" data-jump="' + esc(c.slug) + '">' +
        '<img src="' + esc(tileImage(c.slug)) + '" alt="" loading="lazy">' +
        '<span><small>' + esc(c.name) + "</small><b>" + esc(c.blurb || "") + "</b></span></button>"
    ).join("");
  }
  function tileImage(slug) {
    if (slug === "skincare") return "images/spa-facial.jpg";
    if (slug === "body") return "images/soap-brush.jpg";
    if (slug === "perfume") return "images/perfume-dark.jpg";
    const p = products.find((x) => x.category === slug);
    return p ? imgOf(p) : settings.hero_image;
  }

  function haystack(p) {
    return [p.name, p.description, p.badge, catName(p.category), subName(p.sub), p.category, p.sub].join(" ").toLowerCase();
  }
  function matchesQuery(p, raw) {
    const q = String(raw || "").trim().toLowerCase();
    if (!q) return true;
    const hay = haystack(p);
    if (hay.includes(q)) return true;
    const words = q.split(/\s+/).filter(Boolean);
    return words.length > 1 && words.every((w) => hay.includes(w));
  }
  function visibleList() {
    let list = products.filter((p) => {
      if (wishOnly && !wish.includes(p.id)) return false;
      if (!wishOnly && curCat !== "all" && p.category !== curCat) return false;
      if (!wishOnly && curSub !== "all" && p.sub !== curSub) return false;
      return matchesQuery(p, query);
    });
    const byName = (a, b) => a.name.localeCompare(b.name);
    if (sort === "price-asc") list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0) || byName(a, b));
    else if (sort === "price-desc") list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0) || byName(a, b));
    else if (sort === "name") list.sort(byName);
    else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.sort || 0) - (b.sort || 0));
    return list;
  }

  function renderFilters() {
    const catBtns = '<button type="button" class="chip' + (curCat === "all" && !wishOnly ? " on" : "") + '" data-cat="all">All</button>' +
      cats.map((c) => '<button type="button" class="chip' + (curCat === c.slug && !wishOnly ? " on" : "") + '" data-cat="' + esc(c.slug) + '">' + esc(c.name) + "</button>").join("") +
      '<button type="button" class="chip wish' + (wishOnly ? " on" : "") + '" data-cat="saved">Saved' + (wish.length ? " (" + wish.length + ")" : "") + "</button>";
    $("catRow").innerHTML = catBtns;
    const pool = wishOnly ? subs : (curCat === "all" ? subs : subs.filter((s) => s.category === curCat));
    $("subRow").innerHTML = '<button type="button" class="chip slim' + (curSub === "all" ? " on" : "") + '" data-sub="all">All types</button>' +
      pool.map((s) => '<button type="button" class="chip slim' + (curSub === s.slug ? " on" : "") + '" data-sub="' + esc(s.slug) + '">' + esc(s.name) + "</button>").join("");
  }
  function renderGrid() {
    const list = visibleList();
    $("resultCount").textContent = list.length + (list.length === 1 ? " piece" : " pieces");
    $("productGrid").innerHTML = list.length ? list.map((p) => {
      const out = outOfStock(p);
      const saved = wish.includes(p.id);
      const badge = out ? '<span class="badge out">Sold out</span>' : (p.badge ? '<span class="badge">' + esc(p.badge) + "</span>" : "");
      const stock = lowStock(p) ? '<span class="low">Only ' + Number(p.stock) + " left</span>" : "";
      return '<article class="card" data-id="' + esc(p.id) + '">' +
        '<div class="card-img"><img src="' + esc(imgOf(p)) + '" alt="' + esc(p.name) + '" loading="lazy">' + badge +
        '<button type="button" class="heart' + (saved ? " on" : "") + '" data-wish="' + esc(p.id) + '" aria-label="' + (saved ? "Remove from saved" : "Save") + '" aria-pressed="' + (saved ? "true" : "false") + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"/></svg></button></div>' +
        '<div class="card-body"><span class="kicker">' + esc(catName(p.category)) + " · " + esc(subName(p.sub)) + "</span>" +
        "<h3>" + esc(p.name) + "</h3><p>" + esc(p.description) + "</p>" +
        '<div class="buy"><div class="price">' + priceHtml(p) + stock + "</div>" +
        '<button type="button" class="add" data-add="' + esc(p.id) + '"' + (out ? " disabled" : "") + ">" + (out ? "Sold out" : "Add to bag") + "</button></div></div></article>";
    }).join("") : '<p class="empty">Nothing matches that search. Try a shorter word, or <a data-wa="Hello Queen16 Beauty Empire, I am looking for: ' + esc(query) + '">ask us on WhatsApp</a>.</p>';
    document.querySelectorAll("#productGrid [data-wa]").forEach((a) => { a.href = waLink(a.dataset.wa); });
  }

  let modalQty = 1;
  function openProduct(id, push) {
    const p = products.find((x) => x.id === id);
    if (!p) { closeProduct(false); return; }
    modalQty = 1;
    const out = outOfStock(p);
    const stockLine = out ? "Sold out for now" : (lowStock(p) ? "Only " + Number(p.stock) + " left" : "In stock at GGS Plaza 2");
    $("modalCard").innerHTML =
      '<button type="button" class="modal-x" id="modalX" aria-label="Close">×</button>' +
      '<div class="modal-grid"><div class="modal-photo"><img src="' + esc(imgOf(p)) + '" alt="' + esc(p.name) + '"></div>' +
      '<div class="modal-copy"><p class="kicker">' + esc(catName(p.category)) + " · " + esc(subName(p.sub)) + "</p>" +
      "<h2>" + esc(p.name) + "</h2><div class=\"price lg\">" + priceHtml(p) + "</div>" +
      '<p class="stock">' + esc(stockLine) + "</p><p class=\"desc\">" + esc(p.description) + "</p>" +
      '<div class="pd-actions"><div class="qty" aria-label="Quantity"><button type="button" data-mq="-1" aria-label="Decrease">−</button><span id="mq">1</span><button type="button" data-mq="1" aria-label="Increase">+</button></div>' +
      '<button type="button" class="btn gold" id="modalAdd"' + (out ? " disabled" : "") + ">" + (out ? "Sold out" : "Add to bag") + "</button></div>" +
      '<a class="btn ghost dark" id="askWa" href="' + esc(waLink("Hello Queen16 Beauty Empire, I would like to ask about " + p.name + " (UGX " + Number(p.price || 0).toLocaleString("en-US") + ").")) + '">Ask about this on WhatsApp</a>' +
      '<p class="fine">' + esc(settings.delivery_info || "") + "</p></div></div>";
    $("modal").classList.add("open");
    $("modal").setAttribute("aria-hidden", "false");
    lock(true);
    if (push !== false && location.hash !== "#/p/" + encodeURIComponent(p.id)) {
      history.pushState({ p: p.id }, "", "#/p/" + encodeURIComponent(p.id));
    }
    $("modalX").onclick = () => closeProduct(true);
    $("modalCard").onclick = (e) => {
      const q = e.target.closest("[data-mq]");
      if (q) {
        modalQty = Math.max(1, modalQty + Number(q.dataset.mq));
        if (p.stock != null && p.stock !== "") modalQty = Math.min(modalQty, Math.max(1, Number(p.stock)));
        $("mq").textContent = modalQty;
      }
      if (e.target.id === "modalAdd" && !out) addToCart(p.id, modalQty);
    };
  }
  function closeProduct(fromUser) {
    $("modal").classList.remove("open");
    $("modal").setAttribute("aria-hidden", "true");
    if (!$("cartDrawer").classList.contains("open")) lock(false);
    if (fromUser && location.hash.indexOf("#/p/") === 0) history.pushState({}, "", location.pathname + location.search);
  }
  function route() {
    const m = location.hash.match(/^#\/p\/(.+)$/);
    if (m) openProduct(decodeURIComponent(m[1]), false);
    else if ($("modal").classList.contains("open")) closeProduct(false);
  }

  function saveCart() { localStorage.setItem("q16_cart", JSON.stringify(cart)); }
  function saveWish() { localStorage.setItem("q16_wish", JSON.stringify(wish)); }
  function lines() { return cart.map((c) => ({ c, p: products.find((p) => p.id === c.id) })).filter((x) => x.p); }
  function totals() {
    let total = 0, count = 0;
    lines().forEach(({ c, p }) => { count += c.qty; total += Number(p.price || 0) * c.qty; });
    return { total, count };
  }
  function addToCart(id, qty) {
    qty = qty || 1;
    const p = products.find((x) => x.id === id);
    if (!p || outOfStock(p)) return;
    const it = cart.find((c) => c.id === id);
    if (it) it.qty += qty; else cart.push({ id, qty });
    if (p.stock != null && p.stock !== "") {
      const row = cart.find((c) => c.id === id);
      row.qty = Math.min(row.qty, Math.max(1, Number(p.stock)));
    }
    saveCart();
    renderCart();
    toast("Added to bag");
    const b = document.querySelector('[data-add="' + CSS.escape(id) + '"]');
    if (b && !b.disabled) {
      const old = b.textContent;
      b.textContent = "Added";
      setTimeout(() => { b.textContent = old; }, 900);
    }
  }
  function renderCart() {
    cart = cart.filter((c) => products.some((p) => p.id === c.id) || !products.length);
    const t = totals();
    $("cartBadge").textContent = t.count;
    $("cartBadge").hidden = !t.count;
    $("cartCount").textContent = String(t.count);
    $("cartSubtotal").textContent = S.ugx(t.total) || "UGX 0";
    $("checkoutBtn").disabled = !t.count;
    const rows = lines();
    $("cartItems").innerHTML = rows.length ? rows.map(({ c, p }) =>
      '<div class="ci"><img src="' + esc(imgOf(p)) + '" alt=""><div><div class="ci-name">' + esc(p.name) + "</div>" +
      '<div class="ci-price">' + (S.ugx(p.price * c.qty) || "") + "</div>" +
      '<div class="qty"><button type="button" data-cq="-1" data-id="' + esc(p.id) + '" aria-label="Decrease">−</button><span>' + c.qty + '</span><button type="button" data-cq="1" data-id="' + esc(p.id) + '" aria-label="Increase">+</button></div></div>' +
      '<button type="button" class="rm" data-rm="' + esc(p.id) + '">Remove</button></div>'
    ).join("") : '<p class="cart-empty">Your bag is empty. Choose a piece from the shelf.</p>';
    $("wishBadge").textContent = wish.length;
    $("wishBadge").hidden = !wish.length;
  }
  function openCart(step) {
    $("cartDrawer").classList.add("open");
    $("cartOverlay").classList.add("open");
    $("cartDrawer").setAttribute("aria-hidden", "false");
    lock(true);
    if (step === "details") showDetails();
    else showBag();
  }
  function closeCart() {
    $("cartDrawer").classList.remove("open");
    $("cartOverlay").classList.remove("open");
    $("cartDrawer").setAttribute("aria-hidden", "true");
    if (!$("modal").classList.contains("open")) lock(false);
    showBag();
  }
  window.Q16UI = { openCart, closeCart };
  function showBag() {
    $("cartDrawer").classList.remove("step-details");
    $("drawerTitle").textContent = "Your bag";
    $("bagView").hidden = false;
    $("bagFoot").hidden = false;
    $("detailsView").hidden = true;
  }
  function showDetails() {
    if (!totals().count) return;
    $("cartDrawer").classList.add("step-details");
    $("drawerTitle").textContent = "Checkout";
    $("bagView").hidden = true;
    $("bagFoot").hidden = true;
    $("detailsView").hidden = false;
    const t = totals();
    $("coSum").innerHTML = lines().map(({ c, p }) =>
      "<div><span>" + c.qty + " × " + esc(p.name) + "</span><span>" + S.ugx(p.price * c.qty) + "</span></div>"
    ).join("") + '<div class="tot"><span>Subtotal</span><span>' + S.ugx(t.total) + "</span></div>";
    $("cName").value = cust.name || "";
    $("cPhone").value = cust.phone || "";
    $("cLoc").value = cust.location || "";
    $("coErr").textContent = "";
  }

  function orderRef() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return "Q16-" + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
  function buildMessage(o) {
    const L = ["*QUEEN16 BEAUTY EMPIRE*", "New order from the website", "Reference: " + o.id, ""];
    o.items.forEach((it, i) => {
      const line = S.ugx(it.price);
      const row = S.ugx(it.price * it.qty);
      L.push((i + 1) + ". " + it.name);
      L.push("   " + it.qty + " × " + (line || "UGX —") + "  =  " + (row || "UGX —"));
    });
    L.push("", "*Subtotal: " + (S.ugx(o.total) || "UGX 0") + "*", "",
      "*Customer*",
      "Name: " + o.customer_name,
      "Phone: " + o.customer_phone,
      "Delivery: " + o.location);
    if (o.notes) L.push("Notes: " + o.notes);
    L.push("", "Please confirm stock and delivery. This order is placed when this message is sent.", "GGS Plaza 2, Kampala");
    return L.join("\n");
  }
  window.Q16.buildOrderMessage = buildMessage;

  function placeOrder(ev) {
    if (ev) ev.preventDefault();
    const name = $("cName").value.trim();
    const phone = $("cPhone").value.trim();
    const location = $("cLoc").value.trim();
    const notes = $("cNotes").value.trim();
    if (!name || !phone || !location) {
      $("coErr").textContent = "Please add your name, phone number and delivery location.";
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      $("coErr").textContent = "Please enter a valid phone number.";
      return;
    }
    const o = {
      id: orderRef(),
      customer_name: name,
      customer_phone: phone,
      location: location,
      notes: notes,
      status: "new",
      items: lines().map(({ c, p }) => ({ id: p.id, name: p.name, qty: c.qty, price: Number(p.price || 0) })),
      total: totals().total
    };
    localStorage.setItem("q16_customer", JSON.stringify({ name, phone, location }));
    const url = waLink(buildMessage(o));
    $("placeBtn").href = url;
    window.__lastOrderUrl = url;
    $("coErr").textContent = "WhatsApp is opening. The order is sent only when you press Send there.";
    try { S.createOrder(o); } catch (e) {}
    window.location.href = url;
  }

  function toggleWish(id) {
    if (wish.includes(id)) wish = wish.filter((x) => x !== id);
    else wish.push(id);
    saveWish();
    renderFilters();
    renderGrid();
    renderCart();
  }

  $("catRow").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    if (b.dataset.cat === "saved") { wishOnly = true; curCat = "all"; curSub = "all"; }
    else { wishOnly = false; curCat = b.dataset.cat; curSub = "all"; }
    renderFilters();
    renderGrid();
  });
  $("subRow").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sub]");
    if (!b) return;
    curSub = b.dataset.sub;
    if (curSub !== "all") {
      const sub = subs.find((s) => s.slug === curSub);
      if (sub && !wishOnly) curCat = sub.category;
    }
    renderFilters();
    renderGrid();
  });
  $("catTiles").addEventListener("click", (e) => {
    const b = e.target.closest("[data-jump]");
    if (!b) return;
    wishOnly = false;
    curCat = b.dataset.jump;
    curSub = "all";
    renderFilters();
    renderGrid();
    $("shop").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("sort").addEventListener("change", () => { sort = $("sort").value; renderGrid(); });
  $("search").addEventListener("input", () => { query = $("search").value; renderGrid(); });
  $("productGrid").addEventListener("click", (e) => {
    const w = e.target.closest("[data-wish]");
    if (w) { e.stopPropagation(); toggleWish(w.dataset.wish); return; }
    const a = e.target.closest("[data-add]");
    if (a) { e.stopPropagation(); if (!a.disabled) addToCart(a.dataset.add, 1); return; }
    if (e.target.closest("a")) return;
    const c = e.target.closest(".card");
    if (c) openProduct(c.dataset.id, true);
  });
  $("cartItems").addEventListener("click", (e) => {
    const q = e.target.closest("[data-cq]");
    const r = e.target.closest("[data-rm]");
    if (q) {
      const it = cart.find((c) => c.id === q.dataset.id);
      if (!it) return;
      it.qty += Number(q.dataset.cq);
      if (it.qty < 1) cart = cart.filter((c) => c !== it);
      const p = products.find((x) => x.id === q.dataset.id);
      if (p && p.stock != null && p.stock !== "" && it && cart.includes(it)) it.qty = Math.min(it.qty, Math.max(1, Number(p.stock)));
    }
    if (r) cart = cart.filter((c) => c.id !== r.dataset.rm);
    if (q || r) { saveCart(); renderCart(); if ($("cartDrawer").classList.contains("step-details")) showDetails(); }
  });
  $("cartBtn").addEventListener("click", () => openCart());
  $("wishBtn").addEventListener("click", () => {
    wishOnly = true; curCat = "all"; curSub = "all";
    renderFilters(); renderGrid();
    $("shop").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("cartOverlay").addEventListener("click", closeCart);
  $("cartClose").addEventListener("click", closeCart);
  $("checkoutBtn").addEventListener("click", () => showDetails());
  $("backBag").addEventListener("click", showBag);
  $("placeBtn").addEventListener("click", placeOrder);
  $("modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeProduct(true); });
  $("menuBtn").addEventListener("click", () => {
    const on = document.body.classList.toggle("nav-open");
    $("menuBtn").setAttribute("aria-expanded", on ? "true" : "false");
  });
  document.querySelectorAll("#nav a").forEach((a) => a.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    $("menuBtn").setAttribute("aria-expanded", "false");
  }));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if ($("modal").classList.contains("open")) closeProduct(true);
    else if ($("cartDrawer").classList.contains("open")) closeCart();
    else if (document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      $("menuBtn").setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);

  function stick() {
    const h = document.querySelector("header");
    if (h) document.documentElement.style.setProperty("--header-h", h.offsetHeight + "px");
  }
  stick();
  window.addEventListener("resize", stick);
  applySettings();
  renderCart();
  (async () => {
    try {
      [settings, cats, products] = await Promise.all([S.settings(), S.categories(), S.products()]);
      subs = S.subs();
    } catch (e) {
      console.error(e);
      $("productGrid").innerHTML = '<p class="empty">The shelf could not load. Please refresh, or message us on WhatsApp.</p>';
      return;
    }
    applySettings();
    renderFilters();
    renderGrid();
    renderCart();
    route();
  })();
})();
