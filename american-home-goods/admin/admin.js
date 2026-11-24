/* American Home Goods admin dashboard */
(function () {
  const S = window.AHG, C = window.AHG_CONFIG || {}, esc = S.esc, $ = (id) => document.getElementById(id), app = $("app");
  let tab = "products", products = [], cats = [], settings = {}, pSearch = "", pCat = "all", pShow = "all";

  function toast(t) { const e = $("toast"); e.textContent = t; e.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("show"), 2200); }
  const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || ("item-" + Date.now());
  const intOrNull = (v) => { v = String(v == null ? "" : v).replace(/[^\d]/g, ""); return v === "" ? null : parseInt(v, 10); };
  const catLabel = (slug) => (cats.find((c) => c.slug === slug) || {}).name || "No category";
  const demoBar = () => S.mode === "demo" ? '<div class="demo">Test mode: the database is not connected, changes stay in this browser only.</div>' : "";

  async function boot() {
    if (S.mode === "static") {
      app.innerHTML = '<div class="login"><div class="llogo"><img src="../assets/logo.png" alt="American Home Goods Uganda Ltd" width="345" height="160"><span>Shop admin</span></div><div class="card" style="margin-top:18px"><p>The shop database is not connected yet. Please contact Freca E-Services.</p></div><p class="muted" style="text-align:center;margin-top:10px"><a href="../">← Back to the shop</a></p></div>';
      return;
    }
    const s = await S.session().catch(() => null);
    if (!s) return loginView();
    if (C.ADMIN_EMAIL && s.user && s.user.email && s.user.email.toLowerCase() !== C.ADMIN_EMAIL.toLowerCase()) {
      await S.signOut();
      return loginView("This account is not the shop admin.");
    }
    try { await loadAll(); } catch (e) { app.innerHTML = '<div class="login"><div class="card"><p class="err">' + esc(e.message) + '</p><button class="btn" onclick="location.reload()">Try again</button></div></div>'; return; }
    render();
  }

  function loginView(msg) {
    app.innerHTML = demoBar() + '<div class="login"><div class="llogo"><img src="../assets/logo.png" alt="American Home Goods Uganda Ltd" width="345" height="160"><span>Shop admin</span></div>' +
      '<div class="card" style="margin-top:18px"><form id="lf"><label for="le">Email</label><input id="le" type="email" autocomplete="username" value="' + esc(C.ADMIN_EMAIL || "") + '" required>' +
      '<label for="lp">Password</label><input id="lp" type="password" autocomplete="current-password" required>' +
      '<button class="btn" style="width:100%;margin-top:16px" id="lb">Log in</button><div class="err" id="lerr">' + esc(msg || "") + "</div></form></div>" +
      '<p class="muted" style="text-align:center;margin-top:10px"><a href="../">← Back to the shop</a></p></div>';
    $("lf").onsubmit = async (e) => {
      e.preventDefault(); $("lb").disabled = true; $("lerr").textContent = "";
      try { await S.signIn($("le").value.trim(), $("lp").value); await boot(); }
      catch (err) { $("lerr").textContent = /invalid login/i.test(err.message) ? "Wrong email or password." : err.message; $("lb").disabled = false; }
    };
  }

  async function loadAll() { [products, cats, settings] = await Promise.all([S.products(true), S.categories(true), S.settings()]); }

  function shell(inner) {
    const t = (k, l) => '<button class="tab' + (tab === k ? " on" : "") + '" data-tab="' + k + '">' + l + "</button>";
    app.innerHTML = demoBar() + '<header><div class="wrap"><a class="hlogo" href="../" target="_blank" rel="noopener" aria-label="Open the shop"><img src="../assets/logo-white.png" alt="American Home Goods Uganda Ltd" width="345" height="160"><span>Admin</span></a>' +
      '<div class="row"><a class="btn sec sm" href="../" target="_blank" rel="noopener">View shop</a><button class="btn sec sm" id="logout">Log out</button></div></div></header>' +
      '<div class="wrap"><div class="tabs">' + t("products", "Products (" + products.length + ")") + t("categories", "Categories") + t("settings", "Shop info") + '</div><div id="view">' + inner + "</div></div>";
    app.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => { tab = b.dataset.tab; render(); window.scrollTo(0, 0); });
    $("logout").onclick = async () => { await S.signOut(); loginView(); };
  }
  function render() { if (tab === "categories") return catsView(); if (tab === "settings") return settingsView(); productsView(); }

  /* ---------- Products ---------- */
  function filtered() {
    const words = pSearch.toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      if (pCat !== "all" && p.category !== pCat) return false;
      if (pShow === "out" && p.in_stock !== false) return false;
      if (pShow === "hidden" && !p.hidden) return false;
      const hay = (p.name + " " + p.description).toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }
  function productsView() {
    const out = products.filter((p) => p.in_stock === false).length, hid = products.filter((p) => p.hidden).length;
    shell('<div class="stats"><div class="stat"><b>' + products.length + '</b><span>Products</span></div><div class="stat"><b>' + (products.length - hid) + '</b><span>On the shop</span></div>' +
      '<div class="stat"><b>' + out + '</b><span>Out of stock</span></div><div class="stat"><b>' + hid + '</b><span>Hidden</span></div></div>' +
      '<button class="btn gold" id="addP" style="width:100%;margin-bottom:12px">+ Add a product</button>' +
      '<div class="toolbar"><input id="ps" type="search" placeholder="Search products…" value="' + esc(pSearch) + '">' +
      '<select id="pc"><option value="all">All categories</option>' + cats.map((c) => '<option value="' + esc(c.slug) + '"' + (pCat === c.slug ? " selected" : "") + ">" + esc(c.name) + "</option>").join("") + "</select>" +
      '<select id="pw"><option value="all">All</option><option value="out"' + (pShow === "out" ? " selected" : "") + '>Out of stock</option><option value="hidden"' + (pShow === "hidden" ? " selected" : "") + ">Hidden</option></select></div>" +
      '<div id="plist"></div>');
    drawList();
    $("addP").onclick = () => productForm(null);
    $("ps").oninput = (e) => { pSearch = e.target.value; drawList(); };
    $("pc").onchange = (e) => { pCat = e.target.value; drawList(); };
    $("pw").onchange = (e) => { pShow = e.target.value; drawList(); };
  }
  function drawList() {
    const list = filtered();
    $("plist").innerHTML = list.length ? list.map((p) => '<div class="card pcard' + (p.hidden ? " hidden-p" : "") + '" data-id="' + esc(p.id) + '">' +
      '<div class="thumb">' + ((p.images || [])[0] ? '<img src="' + esc(S.img(p.images[0])) + '" alt="" loading="lazy">' : "") + "</div>" +
      '<div class="pinfo"><div class="pname">' + esc(p.name) + '</div><div class="price">' + esc(S.ugx(p.price)) + '</div>' +
      '<div class="row" style="gap:5px;margin-top:3px"><span class="muted">' + esc(catLabel(p.category)) + "</span>" +
      (p.in_stock === false ? '<span class="pill out">Out of stock</span>' : '<span class="pill in">In stock</span>') + (p.hidden ? '<span class="pill hid">Hidden</span>' : "") + "</div>" +
      '<div class="pactions"><button class="btn sm" data-act="edit">Edit</button>' +
      '<button class="btn sec sm" data-act="stock">' + (p.in_stock === false ? "Mark in stock" : "Mark out of stock") + "</button>" +
      '<button class="btn sec sm" data-act="hide">' + (p.hidden ? "Show on shop" : "Hide") + "</button></div></div></div>").join("")
      : '<p class="empty">No products here.</p>';
    $("plist").querySelectorAll("[data-act]").forEach((b) => b.onclick = async () => {
      const id = b.closest("[data-id]").dataset.id, p = products.find((x) => x.id === id);
      if (b.dataset.act === "edit") return productForm(p);
      b.disabled = true;
      const patch = Object.assign({}, p);
      if (b.dataset.act === "stock") patch.in_stock = p.in_stock === false;
      if (b.dataset.act === "hide") patch.hidden = !p.hidden;
      try { const saved = await S.saveProduct(patch); Object.assign(p, saved); toast("Saved"); productsView(); }
      catch (e) { toast(e.message); b.disabled = false; }
    });
  }

  function specsToText(specs) { return (specs || []).map((s) => s.name + ": " + s.value).join("\n"); }
  function textToSpecs(t) {
    return String(t || "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const i = l.indexOf(":"); return i > 0 ? { name: l.slice(0, i).trim(), value: l.slice(i + 1).trim() } : { name: "Detail", value: l };
    }).filter((s) => s.value);
  }

  function productForm(p) {
    const isNew = !p;
    p = p ? JSON.parse(JSON.stringify(p)) : { id: "", name: "", category: pCat !== "all" ? pCat : (cats[0] || {}).slug || null, price: null, condition: "Brand New", description: "", specs: [], images: [], in_stock: true, hidden: false, featured: false, sort: 0 };
    let imgs = (p.images || []).slice();
    const box = $("modalBox");
    const conds = ["Brand New", "Used", "Refurbished", ""];
    function draw() {
      box.innerHTML = '<div class="box-head"><h2>' + (isNew ? "Add a product" : "Edit product") + '</h2><button class="x" id="fx" type="button" aria-label="Close">&times;</button></div>' +
        '<label for="fName">Product name</label><input id="fName" value="' + esc(p.name) + '" placeholder="e.g. Yamaha PSR-E373 keyboard">' +
        '<div class="g2"><div><label for="fPrice">Price (UGX)</label><input id="fPrice" inputmode="numeric" placeholder="e.g. 1,200,000" value="' + (p.price == null ? "" : Number(p.price).toLocaleString("en-US")) + '"></div>' +
        '<div><label for="fCat">Category</label><select id="fCat"><option value="">No category</option>' + cats.map((c) => '<option value="' + esc(c.slug) + '"' + (c.slug === p.category ? " selected" : "") + ">" + esc(c.name) + "</option>").join("") + "</select></div></div>" +
        '<label for="fCond">Condition</label><select id="fCond">' + conds.map((c) => '<option value="' + esc(c) + '"' + (c === (p.condition || "") ? " selected" : "") + ">" + (c || "Don't show") + "</option>").join("") + "</select>" +
        '<label class="check"><input type="checkbox" id="fStock"' + (p.in_stock !== false ? " checked" : "") + '> In stock</label>' +
        '<label class="check"><input type="checkbox" id="fHidden"' + (p.hidden ? " checked" : "") + '> Hide from the shop</label>' +
        '<label for="fDesc">Description</label><textarea id="fDesc" rows="5">' + esc(p.description || "") + "</textarea>" +
        '<label for="fSpecs">Details (one per line, like Brand: Yamaha)</label><textarea id="fSpecs" rows="3" placeholder="Brand: Yamaha&#10;Power: 400W">' + esc(specsToText(p.specs)) + "</textarea>" +
        '<label>Photos (the first one is the main photo)</label><div class="imgs" id="imgs">' + imgs.map((u, i) => '<div class="imgbox"><img src="' + esc(S.img(u)) + '" alt="">' + (i ? "" : '<span class="first">MAIN</span>') +
          '<div class="ctl"><button type="button" data-il="' + i + '" aria-label="Move left">◀</button><button type="button" data-ix="' + i + '" aria-label="Remove">✕</button><button type="button" data-ir="' + i + '" aria-label="Move right">▶</button></div></div>').join("") +
        '<label class="upl" id="uplLbl">+ Add photo<input type="file" id="fFile" accept="image/*" multiple hidden></label></div>' +
        '<div class="err" id="fErr"></div>' +
        '<div class="sticky-actions"><button class="btn" id="fSave" type="button" style="flex:1">Save product</button>' + (isNew ? "" : '<button class="btn danger" id="fDel" type="button">Delete</button>') + "</div>";
      $("fx").onclick = close;
      box.querySelectorAll("[data-ix]").forEach((b) => b.onclick = () => { keep(); imgs.splice(+b.dataset.ix, 1); draw(); });
      box.querySelectorAll("[data-il]").forEach((b) => b.onclick = () => { keep(); const i = +b.dataset.il; if (i > 0) { [imgs[i - 1], imgs[i]] = [imgs[i], imgs[i - 1]]; draw(); } });
      box.querySelectorAll("[data-ir]").forEach((b) => b.onclick = () => { keep(); const i = +b.dataset.ir; if (i < imgs.length - 1) { [imgs[i + 1], imgs[i]] = [imgs[i], imgs[i + 1]]; draw(); } });
      $("fFile").onchange = async (e) => {
        keep(); const files = Array.from(e.target.files || []); if (!files.length) return;
        $("uplLbl").firstChild.textContent = "Uploading…"; $("fErr").textContent = "";
        for (const f of files) {
          try { imgs.push(await S.uploadImage(f)); }
          catch (err) { $("fErr").textContent = err.message; }
        }
        draw();
      };
      $("fSave").onclick = save;
      if ($("fDel")) $("fDel").onclick = del;
    }
    function keep() {
      p.name = $("fName").value; p.price = intOrNull($("fPrice").value); p.category = $("fCat").value || null; p.condition = $("fCond").value;
      p.in_stock = $("fStock").checked; p.hidden = $("fHidden").checked; p.description = $("fDesc").value; p.specs = textToSpecs($("fSpecs").value);
    }
    async function save() {
      keep();
      if (!p.name.trim()) { $("fErr").textContent = "Please enter the product name."; return; }
      p.name = p.name.trim(); p.images = imgs;
      if (isNew) {
        let id = slugify(p.name), n = 2; while (products.some((x) => x.id === id)) id = slugify(p.name) + "-" + n++;
        p.id = id; p.sort = products.reduce((m, x) => Math.min(m, x.sort || 0), 0) - 10;
      }
      $("fSave").disabled = true; $("fSave").textContent = "Saving…";
      try {
        const saved = await S.saveProduct(p);
        const i = products.findIndex((x) => x.id === saved.id);
        if (i >= 0) products[i] = saved; else products.unshift(saved);
        close(); toast(isNew ? "Product added" : "Product saved"); render();
      } catch (e) { $("fErr").textContent = e.message; $("fSave").disabled = false; $("fSave").textContent = "Save product"; }
    }
    async function del() {
      if (!confirm("Delete \"" + p.name + "\"? This cannot be undone. (To take it off the shop for now, use Hide instead.)")) return;
      try { await S.deleteProduct(p.id); products = products.filter((x) => x.id !== p.id); close(); toast("Product deleted"); render(); }
      catch (e) { $("fErr").textContent = e.message; }
    }
    function close() { $("modal").classList.remove("open"); document.body.style.overflow = ""; }
    draw(); $("modal").classList.add("open"); document.body.style.overflow = "hidden"; $("modal").scrollTop = 0;
  }

  /* ---------- Categories ---------- */
  function catsView() {
    const count = (slug) => products.filter((p) => p.category === slug).length;
    shell('<div class="card"><h3>Add a category</h3><label for="cn">Name</label><input id="cn" placeholder="e.g. Kitchen appliances">' +
      '<label for="cb">Short description</label><input id="cb" placeholder="What is in it"><button class="btn" id="cAdd" style="margin-top:12px;width:100%">Add category</button><div class="err" id="cErr"></div></div>' +
      cats.map((c, i) => '<div class="card" data-slug="' + esc(c.slug) + '"><label>Name</label><input data-f="name" value="' + esc(c.name) + '">' +
        '<label>Short description</label><input data-f="blurb" value="' + esc(c.blurb || "") + '">' +
        '<label class="check"><input type="checkbox" data-f="hidden"' + (c.hidden ? " checked" : "") + "> Hide this category</label>" +
        '<div class="row" style="justify-content:space-between"><span class="muted">' + count(c.slug) + " products</span><div class=\"row\">" +
        (i ? '<button class="btn sec sm" data-up>▲ Up</button>' : "") + (i < cats.length - 1 ? '<button class="btn sec sm" data-down>▼ Down</button>' : "") +
        '<button class="btn sm" data-save>Save</button><button class="btn danger sm" data-del>Delete</button></div></div></div>').join(""));
    $("cAdd").onclick = async () => {
      const name = $("cn").value.trim(); if (!name) { $("cErr").textContent = "Please enter a name."; return; }
      let slug = slugify(name), n = 2; while (cats.some((c) => c.slug === slug)) slug = slugify(name) + "-" + n++;
      try { const c = await S.saveCategory({ slug, name, blurb: $("cb").value.trim(), sort: (cats.length + 1) * 10, hidden: false }); cats.push(c); toast("Category added"); catsView(); }
      catch (e) { $("cErr").textContent = e.message; }
    };
    $("view").querySelectorAll("[data-slug]").forEach((card) => {
      const c = cats.find((x) => x.slug === card.dataset.slug);
      const q = (s) => card.querySelector(s);
      q("[data-save]").onclick = async () => {
        const row = Object.assign({}, c, { name: q('[data-f="name"]').value.trim() || c.name, blurb: q('[data-f="blurb"]').value.trim(), hidden: q('[data-f="hidden"]').checked });
        try { Object.assign(c, await S.saveCategory(row)); toast("Saved"); catsView(); } catch (e) { toast(e.message); }
      };
      q("[data-del]").onclick = async () => {
        const n = count(c.slug);
        if (!confirm("Delete the category \"" + c.name + "\"?" + (n ? " Its " + n + " products will stay, with no category." : ""))) return;
        try { await S.deleteCategory(c.slug); cats = cats.filter((x) => x.slug !== c.slug); products.forEach((p) => { if (p.category === c.slug) p.category = null; }); toast("Category deleted"); catsView(); } catch (e) { toast(e.message); }
      };
      const move = async (d) => {
        const i = cats.indexOf(c), j = i + d; if (j < 0 || j >= cats.length) return;
        [cats[i], cats[j]] = [cats[j], cats[i]];
        try { for (let k = 0; k < cats.length; k++) { if (cats[k].sort !== (k + 1) * 10) { cats[k].sort = (k + 1) * 10; await S.saveCategory(cats[k]); } } toast("Order saved"); } catch (e) { toast(e.message); }
        catsView();
      };
      if (q("[data-up]")) q("[data-up]").onclick = () => move(-1);
      if (q("[data-down]")) q("[data-down]").onclick = () => move(1);
    });
  }

  /* ---------- Shop info ---------- */
  const FIELDS = [
    ["whatsapp", "WhatsApp number for orders (with 256, no +)", "256751148170"],
    ["phone_display", "Phone number as shown on the shop", "+256 751 148170"],
    ["hours", "Opening hours (full)", ""],
    ["hours_short", "Opening hours (short, top of the page)", ""],
    ["address", "Location (full)", ""],
    ["address_short", "Location (short, top of the page)", ""],
    ["directions", "Directions tip", ""],
    ["announcement", "Notice bar at the top (leave empty for none)", "e.g. Closed on Monday for the public holiday"]
  ];
  function settingsView() {
    shell('<div class="card"><h3>Shop info</h3><p class="muted">These show on the shop page. Leave a box empty to use the original wording.</p>' +
      FIELDS.map(([k, l, ph]) => '<label for="s_' + k + '">' + esc(l) + "</label>" + (k === "announcement" || k === "hours" || k === "address"
        ? '<textarea id="s_' + k + '" rows="2" placeholder="' + esc(ph || S.DEFAULTS[k] || "") + '">' + esc(settings[k] !== S.DEFAULTS[k] ? (settings[k] || "") : (settings[k] || "")) + "</textarea>"
        : '<input id="s_' + k + '" placeholder="' + esc(ph || S.DEFAULTS[k] || "") + '" value="' + esc(settings[k] || "") + '">')).join("") +
      '<div class="err" id="sErr"></div><button class="btn" id="sSave" style="width:100%;margin-top:14px">Save shop info</button></div>');
    $("sSave").onclick = async () => {
      const v = {};
      FIELDS.forEach(([k]) => { const x = $("s_" + k).value.trim(); if (x || k === "announcement") v[k] = x; });
      if (v.whatsapp) { v.whatsapp = v.whatsapp.replace(/\D/g, ""); if (v.whatsapp.startsWith("0")) v.whatsapp = "256" + v.whatsapp.slice(1); if (!/^\d{11,15}$/.test(v.whatsapp)) { $("sErr").textContent = "WhatsApp number looks wrong. Use the format 256751148170."; return; } }
      $("sSave").disabled = true;
      try { await S.saveSettings(v); settings = Object.assign({}, S.DEFAULTS, v); toast("Shop info saved"); settingsView(); }
      catch (e) { $("sErr").textContent = e.message; $("sSave").disabled = false; }
    };
  }

  boot();
})();
