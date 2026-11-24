/* American Home Goods shop page */
(function () {
  const S = window.AHG, esc = S.esc;
  const $ = (s, r = document) => r.querySelector(s);
  let SET = Object.assign({}, S.DEFAULTS), PRODUCTS = [], CATS = [], catName = {};
  let currentCat = "all", currentProduct = null, currentImage = 0;

  const wa = (text) => S.waLink(SET.whatsapp, text);
  const orderText = (p) => "Hello American Home Goods, I would like to order: " + p.name + " (" + S.ugx(p.price) + ")." +
    "\nLink: " + location.href.split("#")[0] + "#product-" + p.id;

  function applySettings() {
    document.querySelectorAll("[data-set]").forEach((el) => { const v = SET[el.dataset.set]; if (v) el.textContent = v; });
    document.querySelectorAll("[data-wa]").forEach((a) => { a.href = wa(a.dataset.waText || ""); });
    const an = $("#announce");
    if (SET.announcement) { an.textContent = SET.announcement; an.hidden = false; } else an.hidden = true;
    $("#yr").textContent = new Date().getFullYear();
  }

  function drawCats() {
    const counts = {};
    PRODUCTS.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    const shown = CATS.filter((c) => counts[c.slug]);
    $("#catGrid").innerHTML = shown.map((c) =>
      `<a class="cat-card" href="#shop" data-cat="${esc(c.slug)}"><b>${esc(c.name)}</b><span>${esc(c.blurb || "")}</span><em>${counts[c.slug]} product${counts[c.slug] === 1 ? "" : "s"}</em></a>`).join("");
    $("#filters").innerHTML = [{ slug: "all", name: "All" }].concat(shown).map((c) =>
      `<button class="filter" type="button" data-cat="${esc(c.slug)}" aria-pressed="${c.slug === currentCat}">${esc(c.name)} (${c.slug === "all" ? PRODUCTS.length : counts[c.slug]})</button>`).join("");
  }

  function visible() {
    const q = ($("#q").value || "").trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    return PRODUCTS.filter((p) => {
      if (currentCat !== "all" && p.category !== currentCat) return false;
      if (!words.length) return true;
      const hay = (p.name + " " + p.description + " " + (catName[p.category] || "") + " " + p.condition + " " + (p.specs || []).map((s) => s.value).join(" ")).toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }

  function render() {
    const list = visible();
    const grid = $("#grid");
    if (!list.length) { grid.innerHTML = `<p class="empty">No products match that search. Try another word, or browse a category.</p>`; return; }
    grid.innerHTML = list.map((p) => `
      <article class="card${p.in_stock === false ? " out" : ""}" data-id="${esc(p.id)}">
        <div class="thumb" data-open="${esc(p.id)}">
          <img src="${esc(S.img((p.images || [])[0]))}" alt="${esc(p.name)}" loading="lazy">
          ${p.condition ? `<span class="badge ${p.condition === "Brand New" ? "new" : ""}">${esc(p.condition)}</span>` : ""}
          ${p.in_stock === false ? `<span class="stockout">Out of stock</span>` : ""}
        </div>
        <div class="card-body">
          <h3 data-open="${esc(p.id)}">${esc(p.name)}</h3>
          <div class="price">${esc(S.ugx(p.price))}</div>
          ${p.in_stock === false
            ? `<a class="btn btn-line" href="${wa("Hello American Home Goods, when will this be back in stock: " + p.name + "?")}" target="_blank" rel="noopener">Ask when available</a>`
            : `<a class="btn btn-wa" href="${wa(orderText(p))}" target="_blank" rel="noopener">Order on WhatsApp</a>`}
        </div>
      </article>`).join("");
  }

  function setCat(id) {
    currentCat = id;
    document.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === id ? "true" : "false"));
    render();
  }

  function openProduct(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    currentProduct = p; currentImage = 0;
    drawSheet();
    document.body.classList.add("modal-open", "lock");
    if (location.hash !== "#product-" + p.id) history.replaceState(null, "", "#product-" + p.id);
    document.title = p.name + " | American Home Goods";
  }
  function closeProduct() {
    document.body.classList.remove("modal-open", "lock");
    currentProduct = null;
    document.title = "American Home Goods | Audio, Instruments, Carpentry & Generators in Katwe, Kampala";
    if (location.hash.startsWith("#product-")) history.replaceState(null, "", location.pathname + location.search);
  }
  function drawSheet() {
    const p = currentProduct, imgs = (p.images || []).map(S.img);
    const img = imgs[currentImage] || imgs[0] || "";
    const thumbs = imgs.map((src, i) => `<img class="${i === currentImage ? "on" : ""}" src="${esc(src)}" alt="" data-i="${i}">`).join("");
    const specs = (p.specs || []).filter((s) => s && s.name && s.value).map((s) => `<tr><th>${esc(s.name)}</th><td>${esc(s.value)}</td></tr>`).join("");
    const out = p.in_stock === false;
    $("#sheet").innerHTML = `
      <div class="sheet-top"><span>Product details</span><button type="button" id="closeSheet" aria-label="Close">&times;</button></div>
      <div class="gallery">
        ${img ? `<img class="gallery-main" src="${esc(img)}" alt="${esc(p.name)}">` : ""}
        ${imgs.length > 1 ? `<div class="thumbs">${thumbs}</div>` : ""}
      </div>
      <div class="sheet-body">
        ${p.condition ? `<span class="cond">${esc(p.condition)}</span>` : ""}${out ? `<span class="out-note">Out of stock</span>` : ""}
        <h2 id="modalTitle">${esc(p.name)}</h2>
        <div class="price">${esc(S.ugx(p.price))}</div>
        ${specs ? `<table class="specs">${specs}</table>` : ""}
        <p>${esc(p.description).replace(/\n/g, "<br>")}</p>
        <div class="sheet-actions">
          ${out
            ? `<a class="btn btn-wa btn-lg" href="${wa("Hello American Home Goods, when will this be back in stock: " + p.name + "?")}" target="_blank" rel="noopener">Ask when it's back</a>`
            : `<a class="btn btn-wa btn-lg" href="${wa(orderText(p))}" target="_blank" rel="noopener">Order on WhatsApp</a>`}
          <a class="btn btn-line btn-lg" href="${wa("Hello American Home Goods, I would like to request a quote. I was looking at: " + p.name + ".")}" target="_blank" rel="noopener">Request a quote</a>
        </div>
        <button class="share" type="button" id="shareBtn">Copy link to this product</button>
      </div>`;
    $("#closeSheet").onclick = closeProduct;
    $("#sheet").querySelectorAll(".thumbs img").forEach((t) => t.onclick = () => { currentImage = +t.dataset.i; drawSheet(); });
    $("#shareBtn").onclick = async () => {
      const url = location.href.split("#")[0] + "#product-" + p.id;
      try { if (navigator.share) await navigator.share({ title: p.name, url }); else { await navigator.clipboard.writeText(url); $("#shareBtn").textContent = "Link copied"; } } catch (e) {}
    };
  }

  $("#menuBtn").onclick = () => document.body.classList.toggle("nav-open");
  $("#navPanel").addEventListener("click", (e) => { if (e.target.closest("a")) document.body.classList.remove("nav-open"); });
  $("#filters").addEventListener("click", (e) => { const b = e.target.closest(".filter"); if (b) setCat(b.dataset.cat); });
  $("#catGrid").addEventListener("click", (e) => { const a = e.target.closest("[data-cat]"); if (a) setCat(a.dataset.cat); });
  $("#grid").addEventListener("click", (e) => { const o = e.target.closest("[data-open]"); if (o) openProduct(o.dataset.open); });
  $("#q").addEventListener("input", render);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeProduct(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeProduct(); });
  function bootHash() { const h = decodeURIComponent(location.hash || ""); if (h.startsWith("#product-")) openProduct(h.slice(9)); }
  window.addEventListener("hashchange", bootHash);

  applySettings();
  (async function load() {
    try {
      const [set, cats, prods] = await Promise.all([S.settings().catch(() => SET), S.categories(), S.products()]);
      SET = set; CATS = cats; catName = {}; cats.forEach((c) => { catName[c.slug] = c.name; });
      const visibleCats = new Set(cats.map((c) => c.slug));
      PRODUCTS = prods.filter((p) => !p.category || visibleCats.has(p.category));
      applySettings(); drawCats(); render(); bootHash();
      document.body.dataset.loaded = "1";
    } catch (e) {
      $("#grid").innerHTML = `<p class="empty">Could not load products. Check your internet and refresh, or <a data-wa href="${wa("Hello American Home Goods, I would like to see what is available.")}">ask us on WhatsApp</a>.</p>`;
    }
  })();
})();
