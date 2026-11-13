/* Queen16 Beauty Empire admin */
(function () {
  const S = window.Q16, C = window.Q16_CONFIG, esc = S.esc, $ = (id) => document.getElementById(id), app = $("app");
  let tab = "orders", products = [], cats = [], subList = [], orders = [], settings = {}, oFilter = "all", pSearch = "", estOnly = false;
  const STATUSES = ["awaiting_payment", "waiting_confirmation", "paid", "delivered", "cancelled"];
  const SLABEL = { awaiting_payment: "Not paid yet", waiting_confirmation: "Waiting for confirmation", paid: "Paid", delivered: "Delivered", cancelled: "Cancelled" };
  const subs = () => subList;
  function toast(t) { const e = $("toast"); e.textContent = t; e.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("show"), 1800); }
  const fmtDate = (d) => { try { return new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); } catch (e) { return d; } };
  const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || ("item-" + Date.now());
  const intOrNull = (v) => { v = String(v == null ? "" : v).replace(/[^\d]/g, ""); return v === "" ? null : parseInt(v, 10); };

  async function boot() {
    const s = await S.session().catch(() => null);
    if (!s) return loginView();
    if (C.ADMIN_EMAIL && s.user && s.user.email && s.user.email.toLowerCase() !== C.ADMIN_EMAIL.toLowerCase()) {
      await S.signOut();
      return loginView("This account is not the store admin.");
    }
    await loadAll();
    render();
  }
  function loginView(msg) {
    app.innerHTML = '<div class="login"><div class="brand" style="font-size:2rem">Queen 16<small>Admin</small></div>' +
      '<div class="card" style="margin-top:18px"><form id="lf"><label for="le">Email</label><input id="le" type="email" autocomplete="username" required>' +
      '<label for="lp">Password</label><input id="lp" type="password" autocomplete="current-password" required>' +
      '<button class="btn" style="width:100%;margin-top:16px" id="lb">Sign in</button><div class="err" id="lerr">' + esc(msg || "") + "</div></form></div>" +

      '<p class="muted" style="text-align:center;margin-top:10px"><a href="../">← Back to the shop</a></p></div>';
    $("lf").onsubmit = async (e) => {
      e.preventDefault(); $("lb").disabled = true; $("lerr").textContent = "";
      try { await S.signIn($("le").value.trim(), $("lp").value); await boot(); }
      catch (err) { $("lerr").textContent = err.message === "Invalid login credentials" ? "Wrong email or password." : err.message; $("lb").disabled = false; }
    };
  }
  async function loadAll() {
    [products, cats, subList, settings, orders] = await Promise.all([S.products(true), S.categories(true), S.subs(true), S.settings(), S.orders()]);
  }
  function shell(inner) {
    const t = (k, l) => '<button class="tab' + (tab === k ? " on" : "") + '" data-tab="' + k + '">' + l + "</button>";
    app.innerHTML = '<header><div class="wrap"><div class="brand">Queen 16<small>Admin' + "" + "</small></div>" +
      '<div><a class="btn sec sm" href="../" target="_blank" rel="noopener">View shop</a> <button class="btn sec sm" id="logout">Log out</button></div></div></header>' +
      '<div class="wrap"><div class="tabs">' + t("orders", "Orders (" + orders.filter((o) => o.status === "waiting_confirmation").length + " to confirm)") + t("products", "Products") + t("categories", "Categories") + t("customers", "Customers") + t("settings", "Site settings") + '</div><div id="view">' + inner + "</div></div>";
    app.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => { tab = b.dataset.tab; render(); });
    $("logout").onclick = async () => { await S.signOut(); loginView(); };
  }
  function render() { ({ orders: vOrders, products: vProducts, categories: vCats, customers: vCustomers, settings: vSettings })[tab](); }

  function vOrders() {
    const paidSt = ["paid", "delivered"];
    const revenue = orders.filter((o) => paidSt.includes(o.status)).reduce((a, o) => a + (+o.total || 0), 0);
    const toConfirm = orders.filter((o) => o.status === "waiting_confirmation");
    const today = new Date().toDateString(), todayN = orders.filter((o) => new Date(o.created_at).toDateString() === today).length;
    const list = orders.filter((o) => oFilter === "all" || o.status === oFilter);
    shell('<div class="stats"><div class="stat"><b>' + orders.length + '</b><span>Total orders</span></div><div class="stat"><b>' + todayN + '</b><span>Orders today</span></div>' +
      '<div class="stat"><b>' + toConfirm.length + '</b><span>Waiting for confirmation</span></div><div class="stat"><b>' + (S.ugx(revenue) || "UGX 0") + '</b><span>Paid</span></div></div>' +
      '<p class="muted" style="margin-bottom:10px">When an order says <b>Waiting for confirmation</b>, check your Mobile Money SMS for the transaction ID and amount, then press <b>Mark as Paid</b>.</p>' +
      '<div class="row" style="margin-bottom:10px"><div class="tabs" style="border:0;padding:0;margin:0">' + ["all"].concat(STATUSES).map((s) => '<button class="tab' + (oFilter === s ? " on" : "") + '" data-of="' + s + '">' + (s === "all" ? "All" : SLABEL[s]) + "</button>").join("") + "</div>" +
      '<div><button class="btn sec sm" id="oRefresh">Refresh</button></div></div>' +
      (list.length ? list.map((o) => {
        const items = (typeof o.items === "string" ? JSON.parse(o.items) : o.items) || [];
        const phone = String(o.customer_phone || "").replace(/\D/g, "").replace(/^0/, "256");
        const act = (o.status === "waiting_confirmation" || o.status === "awaiting_payment" ? '<button class="btn sm" data-set="paid" data-oid="' + esc(o.id) + '">Mark as Paid</button> ' : "") +
          (o.status === "paid" ? '<button class="btn sm" data-set="delivered" data-oid="' + esc(o.id) + '">Mark as Delivered</button> ' : "");
        return '<div class="card"><div class="row"><div><b>' + esc(o.id) + '</b> <span class="pill ' + esc(o.status) + '">' + esc(SLABEL[o.status] || o.status) + '</span><div class="muted">' + fmtDate(o.created_at) + '</div></div><b style="color:var(--gold2)">' + (S.ugx(o.total || 0) || "") + "</b></div>" +
          '<div style="margin-top:6px">Transaction ID: ' + (o.txn_id ? '<b class="txn">' + esc(o.txn_id) + "</b>" : '<span class="muted">not entered yet</span>') + (o.paid_at ? ' <span class="muted">· paid ' + fmtDate(o.paid_at) + "</span>" : "") + "</div>" +
          '<div style="margin-top:6px"><b>' + esc(o.customer_name) + '</b> · ' + esc(o.customer_phone) + '<div class="muted">' + esc(o.location) + "</div>" +
          (o.notes ? '<div class="muted">' + esc(o.notes) + "</div>" : "") + "</div>" +
          '<div class="items">' + items.map((i) => '<div class="row"><span>' + i.qty + " × " + esc(i.name) + "</span><span>" + (i.price != null ? S.ugx(i.price * i.qty) : "") + "</span></div>").join("") + "</div>" +
          '<div class="row"><div>' + act + '<select data-os="' + esc(o.id) + '" style="width:auto">' + STATUSES.map((s) => '<option value="' + s + '"' + (s === o.status ? " selected" : "") + ">" + SLABEL[s] + "</option>").join("") + "</select></div>" +
          '<div><a class="btn sm" style="background:#1faa59;color:#fff" target="_blank" rel="noopener" href="https://wa.me/' + phone + "?text=" + encodeURIComponent("Hello " + o.customer_name + ", this is Queen16 Beauty Empire about order " + o.id + ".") + '">WhatsApp</a> <button class="btn danger sm" data-od="' + esc(o.id) + '">Delete</button></div></div></div>';
      }).join("") : '<p class="muted">No orders here yet.</p>'));
    document.querySelectorAll("[data-of]").forEach((b) => b.onclick = () => { oFilter = b.dataset.of; vOrders(); });
    const setSt = async (id, st) => {
      try { const patch = await S.setOrderStatus(id, st); Object.assign(orders.find((o) => o.id === id), patch); toast(SLABEL[st]); vOrders(); } catch (e) { toast(e.message); }
    };
    document.querySelectorAll("[data-set]").forEach((b) => b.onclick = () => {
      if (b.dataset.set === "paid" && !confirm("Mark order " + b.dataset.oid + " as paid? Only do this after you have seen the payment on your phone.")) return;
      setSt(b.dataset.oid, b.dataset.set);
    });
    document.querySelectorAll("[data-os]").forEach((s) => s.onchange = () => setSt(s.dataset.os, s.value));
    document.querySelectorAll("[data-od]").forEach((b) => b.onclick = async () => { if (!confirm("Delete order " + b.dataset.od + "?")) return; await S.deleteOrder(b.dataset.od); orders = orders.filter((o) => o.id !== b.dataset.od); vOrders(); });
    $("oRefresh").onclick = async () => { orders = await S.orders(); vOrders(); toast("Orders refreshed"); };
  }
  function vCustomers() {
    const m = {};
    orders.forEach((o) => {
      const k = String(o.customer_phone || "").replace(/\D/g, "");
      const c = m[k] || (m[k] = { name: o.customer_name, phone: o.customer_phone, location: o.location, n: 0, spent: 0, last: o.created_at });
      c.n++; if (o.status !== "cancelled") c.spent += (+o.total || 0);
      if (o.created_at > c.last) { c.last = o.created_at; c.name = o.customer_name; c.location = o.location; }
    });
    const list = Object.values(m).sort((a, b) => b.last > a.last ? 1 : -1);
    shell('<p class="muted" style="margin-bottom:10px">' + list.length + " customers</p>" + (list.length ? list.map((c) => {
      const ph = String(c.phone).replace(/\D/g, "").replace(/^0/, "256");
      return '<div class="card"><div class="row"><div><b>' + esc(c.name) + '</b><div class="muted">' + esc(c.phone) + " · " + esc(c.location) + "</div><div class=\"muted\">" + c.n + " order(s) · " + (S.ugx(c.spent) || "UGX 0") + " · last " + fmtDate(c.last) + '</div></div><a class="btn sm" style="background:#1faa59;color:#fff" target="_blank" rel="noopener" href="https://wa.me/' + ph + '">WhatsApp</a></div></div>';
    }).join("") : '<p class="muted">No customers yet.</p>'));
  }
  function subOptions(cat, selected) {
    return subs().filter((s) => !cat || s.category === cat).map((s) => '<option value="' + esc(s.slug) + '"' + (s.slug === selected ? " selected" : "") + ">" + esc(s.name) + "</option>").join("");
  }
  function vProducts() {
    const q = pSearch.toLowerCase();
    const list = products.filter((p) => (!estOnly || !p.price_confirmed) && (!q || (p.name + " " + (p.description || "")).toLowerCase().includes(q)));
    const estN = products.filter((p) => !p.price_confirmed).length;
    const cn = (s) => (cats.find((c) => c.slug === s) || {}).name || s;
    const sn = (s) => (subs().find((c) => c.slug === s) || {}).name || s;
    shell('<div class="row" style="margin-bottom:10px"><b>' + products.length + ' products</b><button class="btn" id="pNew">+ Add product</button></div>' +
      '<input class="search" id="pSearch" placeholder="Search products…" value="' + esc(pSearch) + '">' +
      '<label class="check"><input type="checkbox" id="pEst"' + (estOnly ? " checked" : "") + "> Show only estimated prices (" + estN + " to check)</label>" +
      '<div class="plist">' + list.map((p) => '<div class="card" style="' + (p.hidden ? "opacity:.55" : "") + '"><div class="thumb"><img src="' + esc((p.images || [])[0] || "") + '" alt=""></div>' +
        '<div style="flex:1;min-width:0"><div class="pname">' + esc(p.name) + '</div><div class="muted">' + esc(cn(p.category)) + " · " + esc(sn(p.sub)) + (p.stock != null ? " · stock " + p.stock : "") + '</div>' +
        '<div class="price">' + (S.ugx(p.price) || "No price") + (p.show_old_price && p.old_price ? "<s>" + S.ugx(p.old_price) + "</s>" : "") + "</div>" +
        "<div>" + (p.hidden ? '<span class="pill">Hidden</span> ' : "") + (p.featured ? '<span class="pill">Featured</span> ' : "") + (p.price_confirmed ? "" : '<span class="pill est">Estimated price</span> ') + (p.badge ? '<span class="pill new">' + esc(p.badge) + "</span>" : "") + "</div></div>" +
        '<div style="display:flex;flex-direction:column;gap:6px"><button class="btn sm" data-pe="' + esc(p.id) + '">Edit</button><button class="btn sec sm" data-ph="' + esc(p.id) + '">' + (p.hidden ? "Unhide" : "Hide") + "</button></div></div>").join("") + "</div>");
    $("pSearch").oninput = (e) => { pSearch = e.target.value; const pos = e.target.selectionStart; vProducts(); $("pSearch").focus(); $("pSearch").setSelectionRange(pos, pos); };
    $("pNew").onclick = () => editProduct(null);
    $("pEst").onchange = (e) => { estOnly = e.target.checked; vProducts(); };
    document.querySelectorAll("[data-pe]").forEach((b) => b.onclick = () => editProduct(products.find((p) => p.id === b.dataset.pe)));
    document.querySelectorAll("[data-ph]").forEach((b) => b.onclick = async () => {
      const p = Object.assign({}, products.find((x) => x.id === b.dataset.ph));
      p.hidden = !p.hidden;
      try { await S.saveProduct(p); Object.assign(products.find((x) => x.id === p.id), p); toast(p.hidden ? "Hidden from the shop" : "Visible on the shop"); vProducts(); }
      catch (e) { toast(e.message); }
    });
  }
  function editProduct(p) {
    const isNew = !p;
    p = p ? JSON.parse(JSON.stringify(p)) : { id: "", name: "", category: (cats[0] || {}).slug || "facial", sub: ((subList.find((x) => x.category === ((cats[0] || {}).slug || "facial")) || {}).slug) || "", price: null, price_confirmed: true, old_price: null, show_old_price: false, description: "", badge: "", images: [], stock: null, hidden: false, featured: false, sort: products.length + 1 };
    const box = $("modalBox");
    const draw = () => {
      box.innerHTML = '<div class="row"><h2 style="font-size:1.8rem">' + (isNew ? "Add product" : "Edit product") + '</h2><button class="btn sec sm" id="mx">✕</button></div>' +
        '<label>Product name</label><input id="fName" value="' + esc(p.name) + '">' +
        '<div class="g2"><div><label>Price (UGX)</label><input id="fPrice" inputmode="numeric" value="' + (p.price ?? "") + '"></div>' +
        '<div><label>Old price (UGX)</label><input id="fOld" inputmode="numeric" value="' + (p.old_price ?? "") + '"></div></div>' +
        '<label class="check"><input type="checkbox" id="fConf"' + (p.price_confirmed ? " checked" : "") + "> Price confirmed (untick if the price is only an estimate)</label>" +
        '<label class="check"><input type="checkbox" id="fShowOld"' + (p.show_old_price ? " checked" : "") + "> Show the old price with a strikethrough</label>" +
        '<div class="g2"><div><label>Category</label><select id="fCat">' + cats.map((c) => '<option value="' + esc(c.slug) + '"' + (c.slug === p.category ? " selected" : "") + ">" + esc(c.name) + "</option>").join("") + '</select></div>' +
        '<div><label>Type</label><select id="fSub">' + subOptions(p.category, p.sub) + "</select></div></div>" +
        '<div class="g2"><div><label>Label</label><input id="fBadge" placeholder="Popular, New, House pick" value="' + esc(p.badge || "") + '"></div>' +
        '<div><label>Stock qty</label><input id="fStock" inputmode="numeric" placeholder="blank = not tracked" value="' + (p.stock ?? "") + '"></div></div>' +
        '<label>Sort order</label><input id="fSort" inputmode="numeric" value="' + (p.sort ?? "") + '">' +
        '<label>Description</label><textarea id="fDesc" rows="4">' + esc(p.description || "") + "</textarea>" +
        '<label class="check"><input type="checkbox" id="fHidden"' + (p.hidden ? " checked" : "") + "> Hidden</label>" +
        '<label class="check"><input type="checkbox" id="fFeat"' + (p.featured ? " checked" : "") + "> Featured</label>" +
        '<label>Photos (first is the main photo)</label><div class="imgs">' + (p.images || []).map((u, i) => '<div class="imgbox"><img src="' + esc(u) + '" alt="">' + (i ? "" : '<span class="first">MAIN</span>') + '<div class="ctl"><button type="button" data-il="' + i + '">◀</button><button type="button" data-ix="' + i + '">✕</button><button type="button" data-ir="' + i + '">▶</button></div></div>').join("") +
        '<label class="upl" id="uplLbl">+ Photo<input type="file" id="fFile" accept="image/*" multiple hidden></label></div>' +
        '<div class="row" style="margin-top:8px"><input id="fUrl" placeholder="Or paste an image link" style="flex:1"><button class="btn sec sm" id="fUrlAdd" type="button">Add link</button></div>' +
        '<div class="err" id="fErr"></div>' +
        '<div class="sticky-actions"><button class="btn" id="fSave" type="button" style="flex:1">Save product</button>' + (isNew ? "" : '<button class="btn danger" id="fDel" type="button">Delete</button>') + "</div>";
      const grab = () => {
        p.name = $("fName").value.trim();
        const np = intOrNull($("fPrice").value);
        p.price_confirmed = $("fConf").checked;
        if (np !== p.price && np != null && !isNew && !p._confTouched) p.price_confirmed = true;
        p.price = np;
        p.old_price = intOrNull($("fOld").value);
        p.show_old_price = $("fShowOld").checked;
        p.category = $("fCat").value;
        p.sub = $("fSub").value;
        p.badge = $("fBadge").value.trim();
        p.stock = intOrNull($("fStock").value);
        p.sort = intOrNull($("fSort").value) || 0;
        p.description = $("fDesc").value;
        p.hidden = $("fHidden").checked;
        p.featured = $("fFeat").checked;
      };
      $("mx").onclick = () => $("modal").classList.remove("open");
      $("fConf").onchange = () => { p._confTouched = true; };
      $("fPrice").oninput = () => { if (!p._confTouched) $("fConf").checked = true; };
      $("fCat").onchange = () => { grab(); if (!subs().some((s) => s.slug === p.sub && s.category === p.category)) p.sub = (subs().find((s) => s.category === p.category) || {}).slug || ""; draw(); };
      box.querySelectorAll("[data-ix]").forEach((b) => b.onclick = () => { grab(); p.images.splice(+b.dataset.ix, 1); draw(); });
      box.querySelectorAll("[data-il]").forEach((b) => b.onclick = () => { grab(); const i = +b.dataset.il; if (i > 0) [p.images[i - 1], p.images[i]] = [p.images[i], p.images[i - 1]]; draw(); });
      box.querySelectorAll("[data-ir]").forEach((b) => b.onclick = () => { grab(); const i = +b.dataset.ir; if (i < p.images.length - 1) [p.images[i + 1], p.images[i]] = [p.images[i], p.images[i + 1]]; draw(); });
      $("fUrlAdd").onclick = () => { grab(); const u = $("fUrl").value.trim(); if (/^https?:\/\//.test(u) || u.startsWith("images/")) { p.images.push(u); draw(); } };
      $("fFile").onchange = async (e) => {
        grab();
        const files = [...e.target.files];
        $("uplLbl").firstChild.textContent = "Uploading…";
        for (const f of files) { try { p.images.push(await S.uploadImage(f)); } catch (err) { $("fErr").textContent = err.message; } }
        draw();
      };
      $("fSave").onclick = async () => {
        grab();
        if (!p.name) { $("fErr").textContent = "Please enter a product name."; return; }
        if (p.show_old_price && (!p.old_price || !p.price)) { $("fErr").textContent = "Enter both the price and the old price."; return; }
        delete p._confTouched;
        if (isNew) { let id = slugify(p.name); while (products.some((x) => x.id === id)) id += "-" + Math.random().toString(36).slice(2, 5); p.id = id; }
        $("fSave").disabled = true;
        try {
          await S.saveProduct(p);
          const i = products.findIndex((x) => x.id === p.id);
          if (i >= 0) products[i] = p; else products.push(p);
          products.sort((a, b) => (a.sort || 0) - (b.sort || 0));
          $("modal").classList.remove("open");
          toast("Product saved");
          vProducts();
        } catch (err) { $("fErr").textContent = err.message; $("fSave").disabled = false; }
      };
      if ($("fDel")) $("fDel").onclick = async () => {
        if (!confirm('Delete "' + p.name + '"?')) return;
        await S.deleteProduct(p.id);
        products = products.filter((x) => x.id !== p.id);
        $("modal").classList.remove("open");
        toast("Deleted");
        vProducts();
      };
    };
    draw();
    $("modal").classList.add("open");
    $("modal").scrollTop = 0;
  }
  function vCats() {
    shell('<div class="card"><b>Add a main category</b><div class="row" style="margin-top:8px"><input id="cNew" placeholder="Category name" style="flex:1"><button class="btn" id="cAdd">Add</button></div></div>' +
      cats.map((c) => '<div class="card"><div class="row"><input data-cn="' + esc(c.slug) + '" value="' + esc(c.name) + '" style="flex:1"><input data-cs="' + esc(c.slug) + '" value="' + (c.sort || 0) + '" style="width:70px" inputmode="numeric" title="Order"></div>' +
        '<div class="row" style="margin-top:8px"><span class="muted">' + products.filter((p) => p.category === c.slug).length + " products" + (c.hidden ? " · hidden" : "") + '</span><div><button class="btn sm" data-csave="' + esc(c.slug) + '">Save</button> <button class="btn sec sm" data-ch="' + esc(c.slug) + '">' + (c.hidden ? "Unhide" : "Hide") + '</button> <button class="btn danger sm" data-cd="' + esc(c.slug) + '">Delete</button></div></div>' +
        '<div style="margin-top:10px;border-top:1px dashed var(--line);padding-top:8px"><div class="muted" style="margin-bottom:6px">Sub-categories</div>' +
        subList.filter((x) => x.category === c.slug).map((x) => '<div class="row" style="margin-bottom:6px"><input data-sn="' + esc(x.slug) + '" value="' + esc(x.name) + '" style="flex:1"><span class="muted">' + products.filter((p) => p.sub === x.slug).length + '</span><button class="btn sm" data-ssave="' + esc(x.slug) + '">Save</button><button class="btn sec sm" data-sh="' + esc(x.slug) + '">' + (x.hidden ? "Unhide" : "Hide") + '</button><button class="btn danger sm" data-sd="' + esc(x.slug) + '">✕</button></div>').join("") +
        '<div class="row"><input data-snew="' + esc(c.slug) + '" placeholder="New sub-category" style="flex:1"><button class="btn sec sm" data-sadd="' + esc(c.slug) + '">Add</button></div></div></div>').join(""));
    $("cAdd").onclick = async () => {
      const n = $("cNew").value.trim(); if (!n) return;
      const c = { slug: slugify(n), name: n, sort: cats.length + 1, hidden: false, blurb: "" };
      try { await S.saveCategory(c); cats.push(c); toast("Category added"); vCats(); } catch (e) { toast(e.message); }
    };
    document.querySelectorAll("[data-csave]").forEach((b) => b.onclick = async () => {
      const c = cats.find((x) => x.slug === b.dataset.csave);
      c.name = document.querySelector('[data-cn="' + c.slug + '"]').value.trim() || c.name;
      c.sort = intOrNull(document.querySelector('[data-cs="' + c.slug + '"]').value) || 0;
      try { await S.saveCategory(c); toast("Saved"); } catch (e) { toast(e.message); }
    });
    document.querySelectorAll("[data-ch]").forEach((b) => b.onclick = async () => { const c = cats.find((x) => x.slug === b.dataset.ch); c.hidden = !c.hidden; await S.saveCategory(c); vCats(); });
    document.querySelectorAll("[data-cd]").forEach((b) => b.onclick = async () => {
      const n = products.filter((p) => p.category === b.dataset.cd).length;
      if (n) { alert("Move or delete the " + n + " product(s) in this category first."); return; }
      if (!confirm("Delete category and its sub-categories?")) return;
      await S.deleteCategory(b.dataset.cd); cats = cats.filter((c) => c.slug !== b.dataset.cd); subList = subList.filter((x) => x.category !== b.dataset.cd); vCats();
    });
    document.querySelectorAll("[data-sadd]").forEach((b) => b.onclick = async () => {
      const inp = document.querySelector('[data-snew="' + b.dataset.sadd + '"]'); const n = inp.value.trim(); if (!n) return;
      let slug = slugify(n); while (subList.some((x) => x.slug === slug)) slug += "-2";
      const x = { slug, name: n, category: b.dataset.sadd, sort: subList.length + 1, hidden: false };
      try { await S.saveSub(x); subList.push(x); toast("Sub-category added"); vCats(); } catch (e) { toast(e.message); }
    });
    document.querySelectorAll("[data-ssave]").forEach((b) => b.onclick = async () => {
      const x = subList.find((y) => y.slug === b.dataset.ssave);
      x.name = document.querySelector('[data-sn="' + x.slug + '"]').value.trim() || x.name;
      try { await S.saveSub(x); toast("Saved"); } catch (e) { toast(e.message); }
    });
    document.querySelectorAll("[data-sh]").forEach((b) => b.onclick = async () => { const x = subList.find((y) => y.slug === b.dataset.sh); x.hidden = !x.hidden; await S.saveSub(x); vCats(); });
    document.querySelectorAll("[data-sd]").forEach((b) => b.onclick = async () => {
      const n = products.filter((p) => p.sub === b.dataset.sd).length;
      if (n) { alert("Move the " + n + " product(s) in this sub-category first."); return; }
      if (!confirm("Delete sub-category?")) return;
      await S.deleteSub(b.dataset.sd); subList = subList.filter((x) => x.slug !== b.dataset.sd); vCats();
    });
  }
  const FIELDS = [
    ["momo_number", "Mobile Money number customers pay to (shown at checkout)"],
    ["momo_name", "Mobile Money registered name (optional, shown at checkout)"],
    ["momo_network", "Payment network text (e.g. MTN / Airtel Mobile Money)"],
    ["whatsapp", "WhatsApp number for orders, country code, no plus (256700888511)"],
    ["phone_display", "Main phone as shown on the shop"],
    ["phone2_display", "Second phone (optional)"],
    ["instagram", "Instagram username (no @)"],
    ["email", "Email shown on the shop"],
    ["announcement", "Announcement bar (blank hides it)"],
    ["hero_kicker", "Top small line"],
    ["hero_title", "Main headline"],
    ["hero_text", "Headline text", 1],
    ["slogan", "Slogan"],
    ["about_title", "About heading"],
    ["about", "About text", 1],
    ["why_title", "Why-us heading"],
    ["address", "Address"],
    ["hours_note", "Hours note"],
    ["delivery_info", "Delivery note", 1],
    ["footer", "Footer line"]
  ];

  function vSettings() {
    const st = Object.assign({}, S.DEFAULT_SETTINGS, settings);
    shell('<div class="card">' + FIELDS.map(([k, l, ta]) => '<label>' + l + "</label>" + (ta ? '<textarea data-k="' + k + '" rows="3">' + esc(st[k] || "") + "</textarea>" : '<input data-k="' + k + '" value="' + esc(st[k] || "") + '">')).join("") +
      '<label>Why-us points</label>' + (st.why || []).map((w, i) => '<div class="g2" style="margin-bottom:6px"><input data-wt="' + i + '" value="' + esc(w.t) + '"><input data-wd="' + i + '" value="' + esc(w.d) + '"></div>').join("") +

      '<div class="sticky-actions"><button class="btn" id="sSave" style="flex:1">Save site settings</button></div></div>');
    $("sSave").onclick = async () => {
      const v = Object.assign({}, st);
      document.querySelectorAll("[data-k]").forEach((i) => v[i.dataset.k] = i.value);
      v.whatsapp = String(v.whatsapp || "").replace(/\D/g, "").replace(/^0/, "256");
      v.why = (st.why || []).map((w, i) => ({ t: document.querySelector('[data-wt="' + i + '"]').value, d: document.querySelector('[data-wd="' + i + '"]').value }));
      try { await S.saveSettings(v); settings = v; toast("Settings saved"); } catch (e) { toast(e.message); }
    };
  }
  $("modal").onclick = (e) => { if (e.target.id === "modal") $("modal").classList.remove("open"); };
  boot();
})();
