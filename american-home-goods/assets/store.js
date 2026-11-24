/* American Home Goods data layer: Supabase when connected, otherwise the starting products (read only).
   Local demo mode (localhost/?demo=1 with no Supabase URL) keeps admin edits in this browser only, for testing. */
(function () {
  const C = window.AHG_CONFIG || {};
  const D = window.AHG_DEFAULTS || {};
  const T = { p: "ahg_products", c: "ahg_categories", s: "ahg_settings" };
  const LIVE = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);
  const DEMO = !LIVE && (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]demo=1/.test(location.search));
  /* Root of the shop, worked out from where this file is loaded, so the shop works at
     /Profile/american-home-goods/ today and at the root of americanhomegoods.com later. */
  const ROOT = (function () {
    const s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/assets\/store\.js(\?.*)?$/, "") : "./";
  })();
  const bySort = (a, b) => (a.sort || 0) - (b.sort || 0) || String(a.name).localeCompare(String(b.name));
  const chk = (r) => { if (r.error) throw new Error(r.error.message); return r.data; };

  let sb = null;
  async function client() {
    if (sb) return sb;
    if (!window.supabase) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        s.onload = res; s.onerror = () => rej(new Error("Could not load. Check your internet and refresh."));
        document.head.appendChild(s);
      });
    }
    sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
    return sb;
  }

  let seedP = null;
  function seed() {
    if (!seedP) seedP = fetch(ROOT + "assets/seed.json").then((r) => { if (!r.ok) throw new Error("Could not load products."); return r.json(); });
    return seedP;
  }
  const DKEY = "ahg-demo-db-v1";
  async function demoDb() {
    let db = null;
    try { db = JSON.parse(localStorage.getItem(DKEY) || "null"); } catch (e) {}
    if (!db) { const s = await seed(); db = { categories: s.categories, products: s.products, settings: {}, session: null }; localStorage.setItem(DKEY, JSON.stringify(db)); }
    return db;
  }
  const demoSave = (db) => localStorage.setItem(DKEY, JSON.stringify(db));

  const API = {
    mode: LIVE ? "live" : DEMO ? "demo" : "static",
    ROOT, DEFAULTS: Object.assign({}, D),
    img(u) { if (!u) return ""; return /^(https?:|data:|blob:)/.test(u) ? u : ROOT + String(u).replace(/^\.?\//, ""); },
    async settings() {
      if (LIVE) {
        const s = await client();
        const d = chk(await s.from(T.s).select("value").eq("key", "site").maybeSingle());
        return Object.assign({}, D, (d && d.value) || {});
      }
      if (DEMO) return Object.assign({}, D, (await demoDb()).settings);
      return Object.assign({}, D);
    },
    async categories(all) {
      let list;
      if (LIVE) { const s = await client(); list = chk(await s.from(T.c).select("*").order("sort")); }
      else list = DEMO ? (await demoDb()).categories : (await seed()).categories;
      list = list.slice().sort(bySort);
      return all ? list : list.filter((c) => !c.hidden);
    },
    async products(all) {
      let list;
      if (LIVE) {
        const s = await client();
        let q = s.from(T.p).select("*").order("sort");
        if (!all) q = q.eq("hidden", false);
        list = chk(await q);
      } else list = DEMO ? (await demoDb()).products : (await seed()).products;
      list = list.slice().sort(bySort);
      return all ? list : list.filter((p) => !p.hidden);
    },
    async session() {
      if (LIVE) { const s = await client(); const { data } = await s.auth.getSession(); return data.session; }
      if (DEMO) return (await demoDb()).session;
      return null;
    },
    async signIn(email, password) {
      if (LIVE) {
        const s = await client();
        const r = await s.auth.signInWithPassword({ email, password });
        if (r.error) throw new Error(r.error.message);
        return r.data.session;
      }
      if (DEMO) {
        if (!password || email.toLowerCase() !== String(C.ADMIN_EMAIL).toLowerCase()) throw new Error("Invalid login credentials");
        const db = await demoDb(); db.session = { user: { email } }; demoSave(db); return db.session;
      }
      throw new Error("The shop database is not connected yet.");
    },
    async signOut() {
      if (LIVE) { const s = await client(); await s.auth.signOut(); return; }
      if (DEMO) { const db = await demoDb(); db.session = null; demoSave(db); }
    },
    async saveProduct(p) {
      const row = Object.assign({}, p); delete row.created_at; delete row.updated_at;
      if (LIVE) { const s = await client(); return chk(await s.from(T.p).upsert(row).select().single()); }
      const db = await demoDb(); const i = db.products.findIndex((x) => x.id === row.id);
      if (i >= 0) db.products[i] = row; else db.products.push(row); demoSave(db); return row;
    },
    async deleteProduct(id) {
      if (LIVE) { const s = await client(); chk(await s.from(T.p).delete().eq("id", id)); return; }
      const db = await demoDb(); db.products = db.products.filter((x) => x.id !== id); demoSave(db);
    },
    async saveCategory(c) {
      if (LIVE) { const s = await client(); return chk(await s.from(T.c).upsert(c).select().single()); }
      const db = await demoDb(); const i = db.categories.findIndex((x) => x.slug === c.slug);
      if (i >= 0) db.categories[i] = c; else db.categories.push(c); demoSave(db); return c;
    },
    async deleteCategory(slug) {
      if (LIVE) { const s = await client(); chk(await s.from(T.c).delete().eq("slug", slug)); return; }
      const db = await demoDb(); db.categories = db.categories.filter((x) => x.slug !== slug);
      db.products.forEach((p) => { if (p.category === slug) p.category = null; }); demoSave(db);
    },
    async saveSettings(v) {
      if (LIVE) { const s = await client(); chk(await s.from(T.s).upsert({ key: "site", value: v })); return; }
      const db = await demoDb(); db.settings = v; demoSave(db);
    },
    async uploadImage(file) {
      if (!C.CLOUDINARY_CLOUD || !C.CLOUDINARY_PRESET) throw new Error("Photo uploads are not set up yet.");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", C.CLOUDINARY_PRESET);
      if (C.CLOUDINARY_FOLDER) fd.append("folder", C.CLOUDINARY_FOLDER);
      const r = await fetch("https://api.cloudinary.com/v1_1/" + C.CLOUDINARY_CLOUD + "/image/upload", { method: "POST", body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error((j.error && j.error.message) || "Upload failed. Try again.");
      return j.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_1200/");
    },
    ugx(n) { if (n == null || n === "") return "Ask for price"; return "UGX " + Number(n).toLocaleString("en-US"); },
    waLink(number, text) { return "https://wa.me/" + String(number || D.whatsapp).replace(/\D/g, "") + (text ? "?text=" + encodeURIComponent(text) : ""); },
    esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  };
  window.AHG = API;
})();
