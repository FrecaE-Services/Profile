/* Queen16 Beauty Empire data layer.
   Blank Supabase URL/key = preview mode from assets/products.js.
   On localhost only, admin edits stay in localStorage so the dashboard can be tried. */
(function () {
  const C = window.Q16_CONFIG || {};
  const CAT = window.Q16_CATALOG || { categories: [], subs: [], products: [], settings: {} };
  const T = {
    p: "queen16_products",
    c: "queen16_categories",
    s: "queen16_settings",
    o: "queen16_orders"
  };
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const DEFAULT_SETTINGS = clone(CAT.settings || {});
  const DEFAULT_CATS = clone(CAT.categories || []);
  const DEFAULT_SUBS = clone(CAT.subs || []);
  const DEFAULT_PRODUCTS = clone(CAT.products || []);

  let sb = null;
  const live = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const LS = (k) => "q16_local_" + k;
  const lget = (k, d) => {
    try {
      const v = JSON.parse(localStorage.getItem(LS(k)));
      return v == null ? d : v;
    } catch (e) {
      return d;
    }
  };
  const lset = (k, v) => localStorage.setItem(LS(k), JSON.stringify(v));

  async function client() {
    if (!live) return null;
    if (sb) return sb;
    if (!window.supabase) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        s.onload = res;
        s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
    return sb;
  }
  const chk = (r) => {
    if (r.error) throw new Error(r.error.message);
    return r.data;
  };
  const bySort = (a, b) => (a.sort || 0) - (b.sort || 0);

  const API = {
    mode: live ? "live" : isLocal ? "local" : "preview",
    DEFAULT_SETTINGS,
    DEFAULT_SUBS,
    subs() {
      return DEFAULT_SUBS.slice().sort(bySort);
    },
    async settings() {
      if (live) {
        const s = await client();
        const d = chk(await s.from(T.s).select("value").eq("key", "site").maybeSingle());
        return Object.assign({}, DEFAULT_SETTINGS, (d && d.value) || {});
      }
      return Object.assign({}, DEFAULT_SETTINGS, isLocal ? lget("settings", {}) : {});
    },
    async categories(all) {
      let list;
      if (live) {
        const s = await client();
        list = chk(await s.from(T.c).select("*").order("sort"));
      } else list = isLocal ? lget("cats", DEFAULT_CATS) : DEFAULT_CATS;
      list = list.slice().sort(bySort);
      return all ? list : list.filter((c) => !c.hidden);
    },
    async products(all) {
      let list;
      if (live) {
        const s = await client();
        let q = s.from(T.p).select("*").order("sort");
        if (!all) q = q.eq("hidden", false);
        list = chk(await q);
      } else list = isLocal ? lget("products", DEFAULT_PRODUCTS) : DEFAULT_PRODUCTS;
      list = list.slice().sort(bySort);
      return all ? list : list.filter((p) => !p.hidden);
    },
    async createOrder(o) {
      if (live) {
        const s = await client();
        chk(await s.from(T.o).insert(o, { returning: "minimal" }));
        return o;
      }
      if (isLocal) {
        const l = lget("orders", []);
        l.unshift(Object.assign({ created_at: new Date().toISOString() }, o));
        lset("orders", l);
      }
      return o;
    },
    async session() {
      if (live) {
        const s = await client();
        const { data } = await s.auth.getSession();
        return data.session;
      }
      return isLocal && sessionStorage.getItem("q16_local_admin")
        ? { user: { email: C.ADMIN_EMAIL || "local-admin" } }
        : null;
    },
    async signIn(email, password) {
      if (live) {
        const s = await client();
        const r = await s.auth.signInWithPassword({ email, password });
        if (r.error) throw new Error(r.error.message);
        return r.data.session;
      }
      if (isLocal) {
        const expected = (C.ADMIN_EMAIL || "").trim().toLowerCase();
        if (expected && email.trim().toLowerCase() !== expected) throw new Error("Invalid login credentials");
        if (!expected && email.trim().length < 3) throw new Error("Invalid login credentials");
        if (password.length < 8) throw new Error("Invalid login credentials");
        sessionStorage.setItem("q16_local_admin", "1");
        return { user: { email } };
      }
      throw new Error("The store database is not connected yet. Please contact Freca E-Services.");
    },
    async signOut() {
      if (live) {
        const s = await client();
        await s.auth.signOut();
      }
      sessionStorage.removeItem("q16_local_admin");
    },
    async saveProduct(p) {
      if (live) {
        const s = await client();
        return chk(await s.from(T.p).upsert(p).select().single());
      }
      const l = lget("products", DEFAULT_PRODUCTS);
      const i = l.findIndex((x) => x.id === p.id);
      if (i >= 0) l[i] = p;
      else l.push(p);
      lset("products", l);
      return p;
    },
    async deleteProduct(id) {
      if (live) {
        const s = await client();
        chk(await s.from(T.p).delete().eq("id", id));
        return;
      }
      lset("products", lget("products", DEFAULT_PRODUCTS).filter((x) => x.id !== id));
    },
    async saveCategory(c) {
      if (live) {
        const s = await client();
        return chk(await s.from(T.c).upsert(c).select().single());
      }
      const l = lget("cats", DEFAULT_CATS);
      const i = l.findIndex((x) => x.slug === c.slug);
      if (i >= 0) l[i] = c;
      else l.push(c);
      lset("cats", l);
      return c;
    },
    async deleteCategory(slug) {
      if (live) {
        const s = await client();
        chk(await s.from(T.c).delete().eq("slug", slug));
        return;
      }
      lset("cats", lget("cats", DEFAULT_CATS).filter((x) => x.slug !== slug));
    },
    async saveSettings(v) {
      if (live) {
        const s = await client();
        chk(await s.from(T.s).upsert({ key: "site", value: v }));
        return;
      }
      lset("settings", v);
    },
    async orders() {
      if (live) {
        const s = await client();
        return chk(await s.from(T.o).select("*").order("created_at", { ascending: false }));
      }
      return lget("orders", []);
    },
    async setOrderStatus(id, status) {
      if (live) {
        const s = await client();
        chk(await s.from(T.o).update({ status }).eq("id", id));
        return;
      }
      const l = lget("orders", []);
      const o = l.find((x) => x.id === id);
      if (o) o.status = status;
      lset("orders", l);
    },
    async deleteOrder(id) {
      if (live) {
        const s = await client();
        chk(await s.from(T.o).delete().eq("id", id));
        return;
      }
      lset("orders", lget("orders", []).filter((x) => x.id !== id));
    },
    async uploadImage(file) {
      if (!C.CLOUDINARY_CLOUD || !C.CLOUDINARY_PRESET) {
        throw new Error("Cloudinary is not set up yet. Add CLOUDINARY_CLOUD and an unsigned CLOUDINARY_PRESET in assets/config.js, or paste an image link.");
      }
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", C.CLOUDINARY_PRESET);
      fd.append("folder", "queen16-beauty-empire");
      const r = await fetch("https://api.cloudinary.com/v1_1/" + C.CLOUDINARY_CLOUD + "/image/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error((j.error && j.error.message) || "Upload failed");
      return j.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_1200/");
    },
    ugx(n) {
      if (n == null || n === "") return null;
      return "UGX " + Number(n).toLocaleString("en-US");
    },
    esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }
  };
  window.Q16 = API;
})();
