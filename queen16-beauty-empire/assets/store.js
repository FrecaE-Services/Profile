/* Queen16 Beauty Empire data layer (Supabase). */
(function () {
  const C = window.Q16_CONFIG || {};
  const T = { p: "queen16_products", c: "queen16_categories", sc: "queen16_subcategories", s: "queen16_settings", o: "queen16_orders" };
  const DEFAULT_SETTINGS = JSON.parse(JSON.stringify(window.Q16_DEFAULTS || {}));
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
  const chk = (r) => { if (r.error) throw new Error(r.error.message); return r.data; };
  const bySort = (a, b) => (a.sort || 0) - (b.sort || 0);

  const API = {
    mode: "live",
    DEFAULT_SETTINGS,
    async settings() {
      const s = await client();
      const d = chk(await s.from(T.s).select("value").eq("key", "site").maybeSingle());
      return Object.assign({}, DEFAULT_SETTINGS, (d && d.value) || {});
    },
    async categories(all) {
      const s = await client();
      const list = chk(await s.from(T.c).select("*").order("sort")).sort(bySort);
      return all ? list : list.filter((c) => !c.hidden);
    },
    async subs(all) {
      const s = await client();
      const list = chk(await s.from(T.sc).select("*").order("sort")).sort(bySort);
      return all ? list : list.filter((c) => !c.hidden);
    },
    async products(all) {
      const s = await client();
      let q = s.from(T.p).select("*").order("sort");
      if (!all) q = q.eq("hidden", false);
      return chk(await q).sort(bySort);
    },
    /* Pay-first checkout. The database prices the bag and returns the order number. */
    async placeOrder(items, c) {
      const s = await client();
      return chk(await s.rpc("queen16_place_order", { p_items: items, p_name: c.name, p_phone: c.phone, p_location: c.location, p_notes: c.notes || "" }));
    },
    async submitTxn(id, token, txn) {
      const s = await client();
      return chk(await s.rpc("queen16_submit_txn", { p_id: id, p_token: token, p_txn: txn }));
    },
    async session() { const s = await client(); const { data } = await s.auth.getSession(); return data.session; },
    async signIn(email, password) {
      const s = await client();
      const r = await s.auth.signInWithPassword({ email, password });
      if (r.error) throw new Error(r.error.message);
      return r.data.session;
    },
    async signOut() { const s = await client(); await s.auth.signOut(); },
    async saveProduct(p) {
      const s = await client();
      const row = Object.assign({}, p); delete row.created_at; delete row.updated_at;
      return chk(await s.from(T.p).upsert(row).select().single());
    },
    async deleteProduct(id) { const s = await client(); chk(await s.from(T.p).delete().eq("id", id)); },
    async saveCategory(c) { const s = await client(); return chk(await s.from(T.c).upsert(c).select().single()); },
    async deleteCategory(slug) { const s = await client(); chk(await s.from(T.c).delete().eq("slug", slug)); },
    async saveSub(c) { const s = await client(); return chk(await s.from(T.sc).upsert(c).select().single()); },
    async deleteSub(slug) { const s = await client(); chk(await s.from(T.sc).delete().eq("slug", slug)); },
    async saveSettings(v) { const s = await client(); chk(await s.from(T.s).upsert({ key: "site", value: v })); },
    async orders() { const s = await client(); return chk(await s.from(T.o).select("*").order("created_at", { ascending: false })); },
    async setOrderStatus(id, status) {
      const s = await client();
      const patch = { status };
      if (status === "paid") patch.paid_at = new Date().toISOString();
      chk(await s.from(T.o).update(patch).eq("id", id));
      return patch;
    },
    async deleteOrder(id) { const s = await client(); chk(await s.from(T.o).delete().eq("id", id)); },
    async uploadImage(file) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", C.CLOUDINARY_PRESET);
      fd.append("folder", "queen16-beauty-empire");
      const r = await fetch("https://api.cloudinary.com/v1_1/" + C.CLOUDINARY_CLOUD + "/image/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error((j.error && j.error.message) || "Upload failed");
      return j.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_1000/");
    },
    ugx(n) { if (n == null || n === "") return null; return "UGX " + Number(n).toLocaleString("en-US"); },
    esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  };
  window.Q16 = API;
})();
