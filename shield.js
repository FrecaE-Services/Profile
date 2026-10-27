/*!
 * Freca E-Services — 72-Hour Preview Shield, Progressive Part-by-Part Installment Unlock,
 * & In-Page Instant Mobile Money Activation System
 * Central control via shield-config.json + deterministic 6-digit Instant Unlock Codes
 */
(function () {
  "use strict";

  var FALLBACK_CONFIG = {
  "default_preview_hours": 72,
  "freca_wa": "256726978988",
  "momo_number": "0758 991506",
  "momo_name": "FREDRICK MUGAMBE",
  "portfolio_url": "https://frecae-services.github.io/Profile/",
  "sites": {
    "cake-bond-uganda": {
      "name": "Cake Bond Uganda",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256758193701",
      "tier": "standard"
    },
    "ria-cakes": {
      "name": "Ria Cakes and Pastries Uganda",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256701233274",
      "tier": "standard"
    },
    "cuppies-cake-boutique": {
      "name": "Cuppies Cake Boutique",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256786978063",
      "tier": "standard"
    },
    "dk-appliances": {
      "name": "DK Appliances",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256702671069",
      "tier": "ecommerce"
    },
    "cakeness-ug": {
      "name": "Cakeness Ug",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256726978988",
      "tier": "standard"
    },
    "freca-cakes": {
      "name": "FRECA CAKES",
      "status": "portfolio",
      "paid_percent": 100,
      "unlock_stage": 4,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256726978988",
      "tier": "standard"
    },
    "flashie-scents": {
      "name": "Flashie_Scents",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256786804364",
      "tier": "standard"
    },
    "interior-experts": {
      "name": "Interior Experts",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256704390644",
      "tier": "standard"
    },
    "kd-furniture-world": {
      "name": "KD Furniture World Ltd",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256742656321",
      "tier": "standard"
    },
    "lavenders-pastry-lane": {
      "name": "Lavender's Pastry Lane",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256782793220",
      "tier": "standard"
    },
    "machine-world-uganda": {
      "name": "Machine World Uganda",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256752815403",
      "tier": "standard"
    },
    "sweet-perfections-uganda": {
      "name": "Sweet Perfections Uganda",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256777104513",
      "tier": "standard"
    },
    "xander-gadgets-mbarara": {
      "name": "Xander Gadgets Mbarara",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256781626315",
      "tier": "ecommerce"
    },
    "nasser-road-quality-printers": {
      "name": "Nasser Road Quality Printer's",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256704149494",
      "tier": "standard"
    },
    "edwigs-eating-point-entebbe": {
      "name": "Edwig's Eating Point",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256755432546",
      "tier": "standard"
    },
    "kimu-hardware-seeta": {
      "name": "Kimu Hardware",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T06:00:00Z",
      "owner_wa": "256782577686",
      "tier": "standard"
    },
    "spare-parts-ug-kiseka": {
      "name": "SPARE PARTS UG, Kiseka",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T08:00:00Z",
      "owner_wa": "256774188097",
      "tier": "ecommerce"
    },
    "the-attic-salon-mukono": {
      "name": "The Attic Salon, Mukono",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T08:00:00Z",
      "owner_wa": "256706619764",
      "tier": "standard"
    },
    "deniva-shoppers-gulu": {
      "name": "Deniva Shoppers Gulu",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T08:00:00Z",
      "owner_wa": "256783860259",
      "tier": "ecommerce"
    },
    "mbarara-furniture-showroom": {
      "name": "Mbarara Furniture Show Room",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T08:00:00Z",
      "owner_wa": "256772441856",
      "tier": "standard"
    },
    "the-shoe-rack-ug": {
      "name": "The Shoe Rack Ug",
      "status": "preview",
      "paid_percent": 0,
      "unlock_stage": 0,
      "created_at": "2026-10-27T08:00:00Z",
      "owner_wa": "256700812716",
      "tier": "standard"
    }
  }
};

  var scriptEl = document.currentScript || document.querySelector('script[src*="shield.js"]');
  var explicitSlug = scriptEl && scriptEl.getAttribute("data-site-slug");

  function detectSlug() {
    if (explicitSlug) return explicitSlug.trim();
    var path = (window.location.pathname || "").replace(/\/index\.html$/i, "").replace(/\/$/, "");
    var parts = path.split("/").filter(Boolean);
    var last = parts[parts.length - 1] || "";
    return last.replace(/\.html$/i, "");
  }

  function formatPhone(raw) {
    if (!raw) return "+256...";
    var d = String(raw).replace(/\D/g, "");
    if (d.length === 12 && d.indexOf("256") === 0) {
      return "+" + d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6);
    }
    return "+" + d;
  }

  function formatUGX(num) {
    var n = Math.round(Number(num) || 0);
    return "UGX " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function computeUnlockCode(slug, stage) {
    var s = "FRECA-SHIELD-2026:" + String(slug || "").trim().toLowerCase() + ":" + Number(stage);
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return String(100000 + (h % 900000));
  }

  function getConfigUrl() {
    if (scriptEl && scriptEl.src) {
      try {
        return new URL("shield-config.json", scriptEl.src).href;
      } catch (e) {}
    }
    return "../shield-config.json";
  }

  var PACKAGES = {
    standard_managed: {
      id: "standard_managed",
      label: "Standard Managed",
      sub: "We update & manage everything for you",
      price: 150000
    },
    standard_self: {
      id: "standard_self",
      label: "Standard Self-Managed",
      sub: "Includes Owner Admin Dashboard login",
      price: 280000
    },
    ecom_managed: {
      id: "ecom_managed",
      label: "E-Commerce Managed",
      sub: "Online store + we manage updates for you",
      price: 250000
    },
    ecom_self: {
      id: "ecom_self",
      label: "E-Commerce Self-Managed",
      sub: "Full E-Commerce + Owner Admin Dashboard",
      price: 350000
    }
  };

  var PAYMENT_MODES = {
    full_100: {
      id: "full_100",
      percent: 100,
      title: "Buy at Once (100% Full Activation Today)",
      sub: "Unlocks 100% Full Website + All Buttons Immediately",
      unlocksStage: 100
    },
    monthly_50: {
      id: "monthly_50",
      percent: 50,
      title: "50% Monthly Installment",
      sub: "Unlocks Stage 2 (Full Product Catalog Ordering) Immediately",
      unlocksStage: 50
    },
    weekly_25: {
      id: "weekly_25",
      percent: 25,
      title: "25% Weekly Installment",
      sub: "Unlocks Stage 1 (Main Inquiry + First 3 Cards) Immediately",
      unlocksStage: 25
    },
    two_days_10: {
      id: "two_days_10",
      percent: 10,
      title: "10% Every 2 Days Installment",
      sub: "Locks in your custom design & starts Stage 1 activation",
      unlocksStage: 25
    }
  };

  var state = {
    slug: detectSlug(),
    config: FALLBACK_CONFIG,
    site: null,
    timerId: null,
    interceptorBound: false,
    selectedPkg: "standard_managed",
    selectedMode: "weekly_25",
    interceptedNotice: ""
  };

  function normalizeStage(site) {
    if (!site) return { status: "preview", paid_percent: 0, unlock_stage: 0 };
    var st = String(site.status || "preview").toLowerCase();
    var paid = Number(site.paid_percent);
    if (isNaN(paid)) paid = 0;

    if (st === "portfolio") {
      return { status: "portfolio", paid_percent: 100, unlock_stage: 4 };
    }
    if (st === "paused_installment") {
      return { status: "paused_installment", paid_percent: paid, unlock_stage: 0 };
    }
    if (st === "expired") {
      return { status: "expired", paid_percent: 0, unlock_stage: 0 };
    }
    if (st === "active_paid" || paid >= 100) {
      return { status: "active_paid", paid_percent: 100, unlock_stage: 4 };
    }
    if (st === "installment_75" || paid >= 75) {
      return { status: "installment_75", paid_percent: 75, unlock_stage: 3 };
    }
    if (st === "installment_50" || paid >= 50) {
      return { status: "installment_50", paid_percent: 50, unlock_stage: 2 };
    }
    if (st === "installment_25" || paid >= 25) {
      return { status: "installment_25", paid_percent: 25, unlock_stage: 1 };
    }
    return { status: "preview", paid_percent: 0, unlock_stage: 0 };
  }

  function resolveSite(cfg) {
    var sites = (cfg && cfg.sites) || {};
    var base = sites[state.slug];
    if (!base) {
      var rawTitle = (document.title || "Your Business").split(/[—|–-]/)[0].trim();
      var firstWa = document.querySelector('a[href*="wa.me/"]');
      var waMatch = firstWa && firstWa.href.match(/wa\.me\/(\d+)/);
      base = {
        name: rawTitle || "Your Business",
        status: "preview",
        paid_percent: 0,
        unlock_stage: 0,
        created_at: null,
        owner_wa: waMatch ? waMatch[1] : "",
        tier: "standard"
      };
    }
    var s = Object.assign({}, base);

    // Check localStorage instant unlock code override on this device
    try {
      var localStage = Number(localStorage.getItem("freca_unlocked_stage_" + state.slug));
      if (localStage && [25, 50, 75, 100].indexOf(localStage) !== -1) {
        var currentPaid = Number(s.paid_percent) || 0;
        if (localStage > currentPaid && s.status !== "paused_installment") {
          s.paid_percent = localStage;
          s.status = localStage === 100 ? "active_paid" : "installment_" + localStage;
        }
      }
    } catch (e) {}

    // Support URL query override for testing: ?shield_status=installment_25 | installment_50 | installment_75 | active_paid | expired | paused_installment | preview
    try {
      var params = new URLSearchParams(window.location.search);
      var override = params.get("shield_status");
      var paidParam = params.get("paid_percent");
      if (override) s.status = override;
      if (paidParam !== null && paidParam !== "") s.paid_percent = Number(paidParam);
    } catch (e) {}

    var norm = normalizeStage(s);
    s.status = norm.status;
    s.paid_percent = norm.paid_percent;
    s.unlock_stage = norm.unlock_stage;
    return s;
  }

  function getDeadlineMs(site, defaultHours) {
    var hours = Number(defaultHours) || 72;
    var durationMs = hours * 3600 * 1000;
    var storageKey = "freca_shield_start_" + state.slug;
    if (site && site.created_at) {
      var parsed = Date.parse(site.created_at);
      if (!isNaN(parsed)) {
        return parsed + durationMs;
      }
    }
    var saved = null;
    try {
      saved = Number(localStorage.getItem(storageKey));
    } catch (e) {}
    if (!saved || isNaN(saved)) {
      saved = Date.now();
      try {
        localStorage.setItem(storageKey, String(saved));
      } catch (e) {}
    }
    return saved + durationMs;
  }

  function formatRemaining(ms) {
    var totalSec = Math.max(0, Math.floor(ms / 1000));
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }

  function injectStyles() {
    if (document.getElementById("freca-shield-styles")) return;
    var style = document.createElement("style");
    style.id = "freca-shield-styles";
    style.textContent = [
      "#freca-shield-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.45; color: #0f172a; box-sizing: border-box; }",
      "#freca-shield-root *, #freca-shield-root *::before, #freca-shield-root *::after { box-sizing: border-box; }",
      ".fs-banner { position: sticky; top: 0; left: 0; right: 0; z-index: 99990; background: linear-gradient(90deg, #0b132b 0%, #1c2541 60%, #0f172a 100%); color: #ffffff; border-bottom: 2px solid #25D366; padding: 9px 14px; box-shadow: 0 6px 20px rgba(0,0,0,0.32); }",
      ".fs-banner.fs-banner-stage { background: linear-gradient(90deg, #052e16 0%, #14532d 55%, #064e3b 100%); border-bottom-color: #fde047; }",
      ".fs-banner-inner { max-width: 1160px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 12px; font-size: 0.81rem; }",
      ".fs-banner-text { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-weight: 500; }",
      ".fs-banner-text strong { color: #fde047; font-weight: 700; }",
      ".fs-timer { display: inline-flex; align-items: center; background: rgba(253, 224, 71, 0.16); color: #fde047; border: 1px solid rgba(253, 224, 71, 0.45); padding: 2px 8px; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 800; font-size: 0.79rem; letter-spacing: 0.03em; }",
      ".fs-progress-pill { display: inline-flex; align-items: center; gap: 5px; background: rgba(253, 224, 71, 0.2); color: #fde047; border: 1px solid rgba(253, 224, 71, 0.5); padding: 2px 9px; border-radius: 999px; font-weight: 800; font-size: 0.75rem; }",
      ".fs-banner-btn { display: inline-flex; align-items: center; gap: 5px; background: #25D366; color: #052e16 !important; font-weight: 800; font-size: 0.78rem; padding: 6px 13px; border-radius: 999px; text-decoration: none !important; border: none; cursor: pointer; box-shadow: 0 2px 10px rgba(37, 211, 102, 0.4); transition: transform 0.15s ease, background 0.15s ease; white-space: nowrap; }",
      ".fs-banner-btn:hover { background: #22c55e; transform: translateY(-1px); }",
      ".fs-card-lock-badge { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px; padding: 7px 10px; border-radius: 9px; background: #fffbeb; border: 1px dashed #f59e0b; color: #92400e; font-size: 0.74rem; font-weight: 700; cursor: pointer; text-align: left; width: 100%; }",
      ".fs-card-lock-badge:hover { background: #fef3c7; }",
      ".fs-card-unlocked-badge { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; padding: 3px 8px; border-radius: 999px; background: #dcfce7; color: #166534; font-size: 0.7rem; font-weight: 800; }",
      ".fs-modal-backdrop { position: fixed; inset: 0; z-index: 99998; background: rgba(9, 13, 26, 0.82); backdrop-filter: blur(5px); display: none; align-items: center; justify-content: center; padding: 12px; overflow-y: auto; }",
      ".fs-modal-backdrop.fs-open { display: flex; }",
      ".fs-modal { width: 100%; max-width: 580px; max-height: 93vh; overflow-y: auto; background: #ffffff; color: #0f172a; border-radius: 20px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.65); border: 1px solid rgba(15, 23, 42, 0.1); padding: 20px 18px; position: relative; animation: fsPop 0.2s ease-out; }",
      "@keyframes fsPop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }",
      ".fs-modal-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 6px; }",
      ".fs-close-x { background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; width: 32px; height: 32px; border-radius: 50%; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }",
      ".fs-badge-ok { display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: #14532d; font-weight: 800; font-size: 0.74rem; padding: 4px 10px; border-radius: 999px; letter-spacing: 0.02em; }",
      ".fs-modal h3 { margin: 4px 0 6px; font-size: 1.15rem; font-weight: 800; color: #0f172a; line-height: 1.25; }",
      ".fs-modal-lead { margin: 0 0 10px; font-size: 0.84rem; color: #475569; }",
      ".fs-order-preview { background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 11px; padding: 9px 12px; margin: 8px 0 12px; font-size: 0.8rem; color: #1e293b; }",
      ".fs-order-preview small { display: block; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #059669; margin-bottom: 3px; }",
      ".fs-order-preview code { font-family: inherit; font-weight: 600; color: #0f172a; word-break: break-word; display: block; }",
      ".fs-step-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px; margin-bottom: 11px; }",
      ".fs-step-head { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #0f172a; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }",
      ".fs-step-num { width: 20px; height: 20px; border-radius: 50%; background: #0f172a; color: #fde047; font-size: 0.72rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }",
      ".fs-pkg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }",
      ".fs-pkg-card { border: 1.5px solid #cbd5e1; background: #ffffff; border-radius: 11px; padding: 8px 10px; cursor: pointer; text-align: left; transition: all 0.14s ease; }",
      ".fs-pkg-card.fs-selected { border-color: #16a34a; background: #f0fdf4; box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.16); }",
      ".fs-pkg-name { font-weight: 800; font-size: 0.78rem; color: #0f172a; display: block; }",
      ".fs-pkg-price { font-weight: 800; font-size: 0.84rem; color: #15803d; display: block; margin-top: 2px; }",
      ".fs-pkg-sub { font-size: 0.68rem; color: #64748b; display: block; margin-top: 2px; line-height: 1.25; }",
      ".fs-mode-list { display: grid; gap: 6px; }",
      ".fs-mode-card { border: 1.5px solid #cbd5e1; background: #ffffff; border-radius: 10px; padding: 8px 11px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left; }",
      ".fs-mode-card.fs-selected { border-color: #16a34a; background: #f0fdf4; box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.15); }",
      ".fs-mode-title { font-weight: 800; font-size: 0.8rem; color: #0f172a; display: block; }",
      ".fs-mode-sub { font-size: 0.7rem; color: #475569; display: block; }",
      ".fs-mode-amt { font-weight: 800; font-size: 0.82rem; color: #15803d; white-space: nowrap; background: #dcfce7; padding: 3px 8px; border-radius: 8px; }",
      ".fs-momo-box { background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 12px; padding: 10px 12px; margin-bottom: 10px; }",
      ".fs-momo-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }",
      ".fs-momo-num { font-size: 1rem; font-weight: 900; color: #78350f; letter-spacing: 0.02em; }",
      ".fs-momo-name { font-size: 0.75rem; font-weight: 700; color: #92400e; display: block; }",
      ".fs-copy-btn { background: #0f172a; color: #fde047; border: none; border-radius: 8px; padding: 6px 10px; font-size: 0.74rem; font-weight: 800; cursor: pointer; }",
      ".fs-pay-summary { margin-top: 7px; padding-top: 7px; border-top: 1px dashed #fbbf24; font-size: 0.8rem; color: #78350f; display: flex; justify-content: space-between; align-items: center; }",
      ".fs-pay-summary strong { font-size: 0.92rem; color: #052e16; background: #bbf7d0; padding: 2px 8px; border-radius: 6px; }",
      ".fs-input-row { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }",
      ".fs-input { width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.84rem; font-family: inherit; color: #0f172a; background: #ffffff; }",
      ".fs-input:focus { outline: none; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15); }",
      ".fs-btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 7px; width: 100%; background: #25D366; color: #052e16 !important; font-weight: 800; font-size: 0.88rem; padding: 12px 14px; border-radius: 12px; text-decoration: none !important; border: none; cursor: pointer; box-shadow: 0 6px 18px -4px rgba(37, 211, 102, 0.55); text-align: center; }",
      ".fs-btn-primary:hover { background: #22c55e; }",
      ".fs-btn-sms { display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; background: #0f172a; color: #fde047 !important; font-weight: 800; font-size: 0.82rem; padding: 10px 14px; border-radius: 11px; text-decoration: none !important; border: none; cursor: pointer; text-align: center; }",
      ".fs-unlock-box { margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0; }",
      ".fs-unlock-flex { display: flex; gap: 7px; margin-top: 5px; }",
      ".fs-unlock-btn { background: #16a34a; color: #ffffff; border: none; border-radius: 10px; padding: 0 14px; font-weight: 800; font-size: 0.8rem; cursor: pointer; white-space: nowrap; }",
      ".fs-unlock-msg { font-size: 0.76rem; font-weight: 700; margin-top: 5px; }",
      ".fs-btn-secondary { display: inline-flex; align-items: center; justify-content: center; width: 100%; background: #f1f5f9; color: #334155 !important; font-weight: 700; font-size: 0.82rem; padding: 10px 14px; border-radius: 11px; border: 1px solid #cbd5e1; cursor: pointer; text-decoration: none !important; text-align: center; margin-top: 6px; }",
      ".fs-full-lock { position: fixed; inset: 0; z-index: 99997; background: radial-gradient(circle at top, #1e293b 0%, #090d16 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; padding: 18px; overflow-y: auto; }",
      ".fs-lock-card { width: 100%; max-width: 560px; background: rgba(15, 23, 42, 0.94); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 22px; padding: 26px 20px; box-shadow: 0 28px 70px rgba(0, 0, 0, 0.75); text-align: center; margin: auto; }",
      ".fs-lock-icon { width: 60px; height: 60px; border-radius: 50%; background: rgba(253, 224, 71, 0.14); border: 2px solid rgba(253, 224, 71, 0.45); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 12px; }",
      ".fs-lock-sub { display: inline-block; background: rgba(255, 255, 255, 0.1); color: #fde047; font-size: 0.74rem; font-weight: 700; padding: 4px 12px; border-radius: 999px; margin-bottom: 9px; letter-spacing: 0.04em; text-transform: uppercase; }",
      ".fs-lock-card h1 { font-size: clamp(1.3rem, 4.6vw, 1.75rem); font-weight: 800; color: #ffffff; margin: 0 0 9px; line-height: 1.25; }",
      ".fs-lock-card p { font-size: 0.89rem; color: #cbd5e1; margin: 0 0 14px; line-height: 1.5; }",
      ".fs-lock-pricing { text-align: left; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px; padding: 12px 14px; margin: 0 0 16px; font-size: 0.81rem; color: #e2e8f0; }",
      ".fs-lock-pricing div { margin: 5px 0; }",
      ".fs-lock-pricing strong { color: #fde047; }",
      ".fs-lock-btns { display: grid; gap: 9px; }",
      ".fs-btn-outline-light { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: rgba(255, 255, 255, 0.08); color: #ffffff !important; font-weight: 700; font-size: 0.85rem; padding: 11px 15px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.22); text-decoration: none !important; cursor: pointer; }",
      "@media (max-width: 520px) { .fs-banner-inner { justify-content: center; text-align: center; } .fs-pkg-grid { grid-template-columns: 1fr; } .fs-modal { padding: 16px 13px; } }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function ensureRoot() {
    injectStyles();
    var root = document.getElementById("freca-shield-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "freca-shield-root";
      if (document.body.firstChild) {
        document.body.insertBefore(root, document.body.firstChild);
      } else {
        document.body.appendChild(root);
      }
    }
    return root;
  }

  function isFloatingWaLink(link) {
    if (!link) return false;
    var cls = String(link.className || "").toLowerCase();
    if (cls.indexOf("wa-float") !== -1 || cls.indexOf("float") !== -1) return true;
    if (cls.indexOf("fixed") !== -1 && cls.indexOf("bottom") !== -1) return true;
    try {
      var cs = window.getComputedStyle(link);
      if (cs && cs.position === "fixed") {
        var b = parseInt(cs.bottom, 10);
        if (!isNaN(b) && b <= 60) return true;
      }
    } catch (e) {}
    return false;
  }

  function isHeaderOrHeroWaLink(link) {
    if (!link || isFloatingWaLink(link)) return false;
    if (link.closest && link.closest("header, nav, .nav, .hero, .hero-grid")) return true;
    return false;
  }

  function getCatalogWaLinks() {
    var all = Array.prototype.slice.call(
      document.querySelectorAll('a[href*="wa.me/"], a[href*="api.whatsapp.com"], a[href*="whatsapp://"]')
    );
    return all.filter(function (a) {
      if (a.closest && a.closest("#freca-shield-root")) return false;
      if (isFloatingWaLink(a)) return false;
      if (isHeaderOrHeroWaLink(a)) return false;
      if (a.closest && a.closest("footer, #contact, .contact")) return false;
      return true;
    });
  }

  function classifyLinkAction(link, site) {
    if (!link || !site) return { allowed: true };
    var stage = Number(site.unlock_stage) || 0;
    if (stage >= 4 || site.status === "active_paid" || site.status === "portfolio") {
      return { allowed: true };
    }

    var href = String(link.getAttribute("href") || "").toLowerCase();
    var isWa = href.indexOf("wa.me/") !== -1 || href.indexOf("api.whatsapp.com") !== -1 || href.indexOf("whatsapp://") !== -1;
    var isTel = href.indexOf("tel:") === 0;
    var isMaps = href.indexOf("google.com/maps") !== -1 || href.indexOf("maps.app.goo.gl") !== -1;

    if (!isWa && !isTel && !isMaps) return { allowed: true };

    // Stage 0 (0% Preview): Intercept all WA & tel links
    if (stage === 0) {
      if (isWa || isTel) {
        return {
          allowed: false,
          reason: "Preview Mode: Activate your website (or start with a 25% installment) to receive live customer orders on " + formatPhone(site.owner_wa) + "."
        };
      }
      return { allowed: true };
    }

    // Stage 1 (25% Paid): Header/Hero WA + First 3 catalog cards unlocked; cards 4+, floating WA, tel, maps locked until 50%/75%
    if (stage === 1) {
      if (isHeaderOrHeroWaLink(link)) return { allowed: true };
      var catLinks = getCatalogWaLinks();
      var idx = catLinks.indexOf(link);
      if (idx !== -1 && idx < 3) {
        return { allowed: true };
      }
      if (idx >= 3) {
        return {
          allowed: false,
          nextStage: 50,
          reason: "🔒 Item #" + (idx + 1) + " unlocks at your 50% Installment (Stage 2: Full Product Catalog Unlock)."
        };
      }
      return {
        allowed: false,
        nextStage: 50,
        reason: "🔒 This button unlocks as you progress your installment plan (Stage 1: Header & first 3 items are currently active)."
      };
    }

    // Stage 2 (50% Paid): Header/Hero + ALL catalog cards unlocked; floating WA, tel, maps unlock at 75%
    if (stage === 2) {
      if (isFloatingWaLink(link) || isMaps || isTel) {
        return {
          allowed: false,
          nextStage: 75,
          reason: "🔒 Floating WhatsApp widget, direct phone calls & Google Maps directions unlock at 75% Installment (Stage 3)."
        };
      }
      return { allowed: true };
    }

    // Stage 3 (75% Paid): All interactive customer buttons unlocked!
    return { allowed: true };
  }

  function decorateStageCards(site) {
    var oldBadges = document.querySelectorAll(".fs-card-lock-badge, .fs-card-unlocked-badge");
    for (var i = 0; i < oldBadges.length; i++) {
      if (oldBadges[i].parentNode) oldBadges[i].parentNode.removeChild(oldBadges[i]);
    }
    if (!site || site.unlock_stage !== 1) return;

    var catLinks = getCatalogWaLinks();
    catLinks.forEach(function (link, idx) {
      if (idx < 3) {
        var ok = document.createElement("div");
        ok.className = "fs-card-unlocked-badge";
        ok.textContent = "✅ Stage 1 Unlocked (Live Order Active)";
        link.insertAdjacentElement("afterend", ok);
      } else {
        var lockBtn = document.createElement("button");
        lockBtn.type = "button";
        lockBtn.className = "fs-card-lock-badge";
        lockBtn.innerHTML = "<span>🔒 Unlocks at 50% Installment</span><span>Tap to Upgrade →</span>";
        lockBtn.addEventListener("click", function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          openCheckoutModal("🔒 Unlock all product cards by completing your 50% Installment (Stage 2).", "monthly_50");
        });
        link.insertAdjacentElement("afterend", lockBtn);
      }
    });
  }

  function renderBannerHtml(site) {
    var bizName = escapeHtml(site.name || "Your Business");
    var stage = Number(site.unlock_stage) || 0;

    if (stage === 1) {
      return (
        '<div class="fs-banner fs-banner-stage" role="region" aria-label="Installment Stage 1 Active">' +
          '<div class="fs-banner-inner">' +
            '<div class="fs-banner-text">' +
              '<span class="fs-progress-pill">✅ 25% Paid (Stage 1 Active)</span>' +
              '<span>Main Inquiry &amp; First 3 Items Live • <strong>Next: Unlock Full Product Catalog at 50%</strong></span>' +
            '</div>' +
            '<button type="button" class="fs-banner-btn" id="fs-banner-activate-btn">💳 Pay Next Installment</button>' +
          '</div>' +
        '</div>'
      );
    }
    if (stage === 2) {
      return (
        '<div class="fs-banner fs-banner-stage" role="region" aria-label="Installment Stage 2 Active">' +
          '<div class="fs-banner-inner">' +
            '<div class="fs-banner-text">' +
              '<span class="fs-progress-pill">✅ 50% Paid (Catalog Unlocked)</span>' +
              '<span>All Product Cards Live • <strong>Complete remaining balance for 100% Full Ownership</strong></span>' +
            '</div>' +
            '<button type="button" class="fs-banner-btn" id="fs-banner-activate-btn">💳 Pay Installment</button>' +
          '</div>' +
        '</div>'
      );
    }
    if (stage === 3) {
      return (
        '<div class="fs-banner fs-banner-stage" role="region" aria-label="Installment Stage 3 Active">' +
          '<div class="fs-banner-inner">' +
            '<div class="fs-banner-text">' +
              '<span class="fs-progress-pill">✅ 75% Paid (Stage 3 Active)</span>' +
              '<span>Floating WhatsApp, Maps &amp; Catalog Live • <strong>Clear final 25% to remove owner bar</strong></span>' +
            '</div>' +
            '<button type="button" class="fs-banner-btn" id="fs-banner-activate-btn">💳 Clear Final 25%</button>' +
          '</div>' +
        '</div>'
      );
    }

    return (
      '<div class="fs-banner" role="region" aria-label="Live Preview Notice">' +
        '<div class="fs-banner-inner">' +
          '<div class="fs-banner-text">' +
            '<span>🔒 <strong>72-Hour Live Preview</strong> for ' + bizName + '</span>' +
            '<span>• Expires in <span class="fs-timer" id="fs-countdown-text">72:00:00</span></span>' +
          '</div>' +
          '<button type="button" class="fs-banner-btn" id="fs-banner-activate-btn">⚡ Activate Now / Buy Website</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderModalHtml(site, cfg) {
    var bizName = escapeHtml(site.name || "Your Business");
    var ownerPhone = escapeHtml(formatPhone(site.owner_wa));
    var momoNum = escapeHtml((cfg && cfg.momo_number) || "0758 991506");
    var momoName = escapeHtml((cfg && cfg.momo_name) || "FREDRICK MUGAMBE");

    return (
      '<div class="fs-modal-backdrop" id="fs-preview-modal" role="dialog" aria-modal="true" aria-labelledby="fs-modal-title">' +
        '<div class="fs-modal">' +
          '<div class="fs-modal-top">' +
            '<span class="fs-badge-ok" id="fs-modal-badge">✅ Instant Website Activation &amp; Installment Checkout</span>' +
            '<button type="button" class="fs-close-x" id="fs-modal-x-btn" aria-label="Close">✕</button>' +
          '</div>' +
          '<h3 id="fs-modal-title">Activate ' + bizName + ' (' + ownerPhone + ')</h3>' +
          '<p class="fs-modal-lead">Pick your package and payment plan below, pay via Mobile Money, and unlock your live customer WhatsApp ordering immediately.</p>' +
          '<div class="fs-order-preview" id="fs-order-preview-box">' +
            '<small id="fs-order-preview-label">✅ Order Button Works! Customer Message Ready:</small>' +
            '<code id="fs-intercepted-msg">Hi ' + bizName + '! I saw your website and would like to place an order.</code>' +
          '</div>' +
          '<div class="fs-step-block">' +
            '<div class="fs-step-head"><span class="fs-step-num">1</span><span>Pick Your Website Package</span></div>' +
            '<div class="fs-pkg-grid" id="fs-pkg-grid"></div>' +
          '</div>' +
          '<div class="fs-step-block">' +
            '<div class="fs-step-head"><span class="fs-step-num">2</span><span>Pick Payment Mode (Progressive Unlock)</span></div>' +
            '<div class="fs-mode-list" id="fs-mode-list"></div>' +
          '</div>' +
          '<div class="fs-step-block">' +
            '<div class="fs-step-head"><span class="fs-step-num">3</span><span>Pay via Mobile Money &amp; Instant Activation</span></div>' +
            '<div class="fs-momo-box">' +
              '<div class="fs-momo-row">' +
                '<div>' +
                  '<span class="fs-momo-num" id="fs-momo-num-text">📲 ' + momoNum + '</span>' +
                  '<span class="fs-momo-name">Registered Name: ' + momoName + '</span>' +
                '</div>' +
                '<button type="button" class="fs-copy-btn" id="fs-copy-momo-btn">📋 Copy Number</button>' +
              '</div>' +
              '<div class="fs-pay-summary">' +
                '<span id="fs-summary-label">Amount to Pay Today:</span>' +
                '<strong id="fs-summary-amount">UGX 37,500</strong>' +
              '</div>' +
            '</div>' +
            '<div class="fs-input-row">' +
              '<input type="text" class="fs-input" id="fs-momo-ref-input" placeholder="Enter Mobile Money Transaction ID or Last 4 Digits of Sender Phone" />' +
              '<button type="button" class="fs-btn-primary" id="fs-confirm-wa-btn">🟢 Confirm Payment &amp; Send Activation Alert (WhatsApp)</button>' +
              '<a class="fs-btn-sms" id="fs-confirm-sms-link" href="#">📩 Or Send Payment Alert via SMS to ' + momoNum + '</a>' +
            '</div>' +
            '<div class="fs-unlock-box">' +
              '<div style="font-size:0.76rem;font-weight:800;color:#0f172a;">🔑 Received Your 6-Digit Instant Unlock Code from Freca?</div>' +
              '<div class="fs-unlock-flex">' +
                '<input type="text" class="fs-input" id="fs-unlock-code-input" maxlength="10" placeholder="Enter 6-digit unlock code (e.g. 482910)" />' +
                '<button type="button" class="fs-unlock-btn" id="fs-apply-code-btn">Unlock Now</button>' +
              '</div>' +
              '<div class="fs-unlock-msg" id="fs-unlock-feedback"></div>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="fs-btn-secondary" id="fs-modal-close-btn">Continue Testing Preview</button>' +
        '</div>' +
      '</div>'
    );
  }

  function updateCheckoutCalculations() {
    var site = state.site || {};
    var cfg = state.config || FALLBACK_CONFIG;
    var pkg = PACKAGES[state.selectedPkg] || PACKAGES.standard_managed;
    var mode = PAYMENT_MODES[state.selectedMode] || PAYMENT_MODES.weekly_25;
    var amountToday = Math.round((pkg.price * mode.percent) / 100);

    var pkgGrid = document.getElementById("fs-pkg-grid");
    if (pkgGrid) {
      pkgGrid.innerHTML = Object.keys(PACKAGES)
        .map(function (k) {
          var p = PACKAGES[k];
          var sel = p.id === pkg.id ? " fs-selected" : "";
          return (
            '<button type="button" class="fs-pkg-card' + sel + '" data-pkg-id="' + p.id + '">' +
              '<span class="fs-pkg-name">' + escapeHtml(p.label) + '</span>' +
              '<span class="fs-pkg-price">' + escapeHtml(formatUGX(p.price)) + '</span>' +
              '<span class="fs-pkg-sub">' + escapeHtml(p.sub) + '</span>' +
            '</button>'
          );
        })
        .join("");

      var pkgBtns = pkgGrid.querySelectorAll("[data-pkg-id]");
      for (var i = 0; i < pkgBtns.length; i++) {
        pkgBtns[i].addEventListener("click", function () {
          state.selectedPkg = this.getAttribute("data-pkg-id");
          updateCheckoutCalculations();
        });
      }
    }

    var modeList = document.getElementById("fs-mode-list");
    if (modeList) {
      modeList.innerHTML = Object.keys(PAYMENT_MODES)
        .map(function (k) {
          var m = PAYMENT_MODES[k];
          var amt = Math.round((pkg.price * m.percent) / 100);
          var sel = m.id === mode.id ? " fs-selected" : "";
          return (
            '<button type="button" class="fs-mode-card' + sel + '" data-mode-id="' + m.id + '">' +
              '<div>' +
                '<span class="fs-mode-title">' + escapeHtml(m.title) + '</span>' +
                '<span class="fs-mode-sub">' + escapeHtml(m.sub) + '</span>' +
              '</div>' +
              '<span class="fs-mode-amt">' + escapeHtml(formatUGX(amt)) + '</span>' +
            '</button>'
          );
        })
        .join("");

      var modeBtns = modeList.querySelectorAll("[data-mode-id]");
      for (var j = 0; j < modeBtns.length; j++) {
        modeBtns[j].addEventListener("click", function () {
          state.selectedMode = this.getAttribute("data-mode-id");
          updateCheckoutCalculations();
        });
      }
    }

    var sumLabel = document.getElementById("fs-summary-label");
    var sumAmt = document.getElementById("fs-summary-amount");
    if (sumLabel) {
      sumLabel.textContent = pkg.label + " (" + mode.percent + "% Today):";
    }
    if (sumAmt) {
      sumAmt.textContent = formatUGX(amountToday);
    }

    var refInput = document.getElementById("fs-momo-ref-input");
    var refVal = (refInput && refInput.value.trim()) || "Pending / Sent via MoMo";
    var bizName = site.name || "My Business";
    var alertText =
      "Hi Freca E-Services! I have sent Mobile Money payment to activate my website.\n" +
      "• Business: " + bizName + " (" + state.slug + ")\n" +
      "• Package: " + pkg.label + " (" + formatUGX(pkg.price) + ")\n" +
      "• Plan: " + mode.title + "\n" +
      "• Amount Paid Today: " + formatUGX(amountToday) + "\n" +
      "• MoMo Ref / Sender: " + refVal + "\n" +
      "Please send my 6-digit Instant Unlock Code / activate my link!";

    var smsLink = document.getElementById("fs-confirm-sms-link");
    if (smsLink) {
      smsLink.setAttribute("href", "sms:+256758991506?body=" + encodeURIComponent(alertText));
    }
  }

  function openCheckoutModal(customNotice, preferredMode) {
    var modal = document.getElementById("fs-preview-modal");
    if (!modal) return;
    if (preferredMode && PAYMENT_MODES[preferredMode]) {
      state.selectedMode = preferredMode;
    }
    var msgEl = document.getElementById("fs-intercepted-msg");
    if (msgEl && customNotice) {
      msgEl.textContent = customNotice;
    }
    updateCheckoutCalculations();
    modal.classList.add("fs-open");
  }

  function renderMainUI(site, cfg) {
    var root = ensureRoot();
    state.selectedPkg = site.tier === "ecommerce" ? "ecom_managed" : "standard_managed";
    if (site.unlock_stage === 1) state.selectedMode = "monthly_50";
    else if (site.unlock_stage === 2) state.selectedMode = "full_100";
    else if (site.unlock_stage === 3) state.selectedMode = "weekly_25";

    root.innerHTML = renderBannerHtml(site) + renderModalHtml(site, cfg);
    updateCheckoutCalculations();
    decorateStageCards(site);

    var modal = document.getElementById("fs-preview-modal");
    var openBtn = document.getElementById("fs-banner-activate-btn");
    var closeBtn = document.getElementById("fs-modal-close-btn");
    var closeX = document.getElementById("fs-modal-x-btn");

    if (openBtn) {
      openBtn.addEventListener("click", function () {
        openCheckoutModal(
          "Direct Activation / Installment Upgrade for " + (site.name || "Your Business") + " (" + formatPhone(site.owner_wa) + ")"
        );
      });
    }
    var closeFn = function () {
      if (modal) modal.classList.remove("fs-open");
    };
    if (closeBtn) closeBtn.addEventListener("click", closeFn);
    if (closeX) closeX.addEventListener("click", closeFn);
    if (modal) {
      modal.addEventListener("click", function (ev) {
        if (ev.target === modal) closeFn();
      });
    }

    var copyBtn = document.getElementById("fs-copy-momo-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var raw = "0758991506";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(raw).catch(function () {});
        }
        copyBtn.textContent = "✅ Copied 0758991506!";
        setTimeout(function () {
          copyBtn.textContent = "📋 Copy Number";
        }, 2200);
      });
    }

    var refInput = document.getElementById("fs-momo-ref-input");
    if (refInput) {
      refInput.addEventListener("input", updateCheckoutCalculations);
    }

    var waConfirmBtn = document.getElementById("fs-confirm-wa-btn");
    if (waConfirmBtn) {
      waConfirmBtn.addEventListener("click", function () {
        updateCheckoutCalculations();
        var pkg = PACKAGES[state.selectedPkg] || PACKAGES.standard_managed;
        var mode = PAYMENT_MODES[state.selectedMode] || PAYMENT_MODES.weekly_25;
        var amountToday = Math.round((pkg.price * mode.percent) / 100);
        var refVal = (refInput && refInput.value.trim()) || "Just paid via Mobile Money";
        var frecaWa = (cfg && cfg.freca_wa) || "256726978988";
        var msg =
          "Hi Freca E-Services! I have sent Mobile Money payment to activate my website.\n" +
          "• Business: " + (site.name || "My Business") + " (" + state.slug + ")\n" +
          "• Package: " + pkg.label + " (" + formatUGX(pkg.price) + ")\n" +
          "• Plan: " + mode.title + "\n" +
          "• Amount Paid Today: " + formatUGX(amountToday) + "\n" +
          "• MoMo Ref / Sender: " + refVal + "\n" +
          "Please send my 6-digit Instant Unlock Code / activate my link!";
        window.open("https://wa.me/" + frecaWa + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
      });
    }

    var applyCodeBtn = document.getElementById("fs-apply-code-btn");
    var codeInput = document.getElementById("fs-unlock-code-input");
    var feedbackEl = document.getElementById("fs-unlock-feedback");
    if (applyCodeBtn && codeInput) {
      applyCodeBtn.addEventListener("click", function () {
        var entered = codeInput.value.replace(/\D/g, "").trim();
        var matchedStage = null;
        [25, 50, 75, 100].forEach(function (st) {
          if (entered && entered === computeUnlockCode(state.slug, st)) {
            matchedStage = st;
          }
        });
        if (matchedStage) {
          try {
            localStorage.setItem("freca_unlocked_stage_" + state.slug, String(matchedStage));
          } catch (e) {}
          if (feedbackEl) {
            feedbackEl.style.color = "#15803d";
            feedbackEl.textContent = "✅ Code verified! Unlocked " + matchedStage + "% Stage immediately.";
          }
          setTimeout(function () {
            applyShield(state.config);
          }, 500);
        } else {
          if (feedbackEl) {
            feedbackEl.style.color = "#dc2626";
            feedbackEl.textContent = "❌ Invalid unlock code for " + (site.name || state.slug) + ". Send your MoMo confirmation above to get your code.";
          }
        }
      });
    }
  }

  function renderExpiredScreen(site, cfg) {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    var root = ensureRoot();
    var bizName = escapeHtml(site.name || "Your Business");
    var momoNum = escapeHtml((cfg && cfg.momo_number) || "0758 991506");
    var momoRaw = String((cfg && cfg.momo_number) || "0758991506").replace(/\s+/g, "");
    var momoName = escapeHtml((cfg && cfg.momo_name) || "FREDRICK MUGAMBE");
    var portfolioUrl = escapeHtml((cfg && cfg.portfolio_url) || "https://frecae-services.github.io/Profile/");
    var frecaWa = (cfg && cfg.freca_wa) || "256726978988";
    var reactivateWa =
      "https://wa.me/" +
      frecaWa +
      "?text=" +
      encodeURIComponent(
        "Hi Freca E-Services! Please reactivate my custom website for " +
          (site.name || "my business") +
          ". I am ready to start with my first installment or full payment."
      );

    document.body.style.overflow = "hidden";
    root.innerHTML =
      '<div class="fs-full-lock" role="alertdialog" aria-modal="true">' +
        '<div class="fs-lock-card">' +
          '<div class="fs-lock-icon">🔒</div>' +
          '<span class="fs-lock-sub">' + bizName + '</span>' +
          '<h1>⏱️ 72-Hour Preview Window Ended — Reactivate with Freca E-Services</h1>' +
          '<p>Your custom website design for <strong>' + bizName + '</strong> is safely saved and ready to go live immediately upon your first installment or full payment.</p>' +
          '<div class="fs-lock-pricing">' +
            '<div>✅ <strong>Standard Websites:</strong> UGX 150,000 (Managed) or UGX 280,000 (Self-Managed Dashboard)</div>' +
            '<div>✅ <strong>Full E-Commerce Stores:</strong> UGX 250,000 (Managed) or UGX 350,000–450,000 (Self-Managed)</div>' +
            '<div>💳 <strong>Progressive Installments:</strong> 10% every 2 days, 25% weekly, or 50% monthly</div>' +
            '<div>📲 <strong>Mobile Money:</strong> ' + momoNum + ' (' + momoName + ')</div>' +
          '</div>' +
          '<div class="fs-lock-btns">' +
            '<button type="button" class="fs-btn-primary" id="fs-expired-open-checkout">⚡ Pay Installment / Reactivate Instantly</button>' +
            '<a class="fs-btn-outline-light" href="' + escapeHtml(reactivateWa) + '" target="_blank" rel="noopener">💬 Reactivate on WhatsApp (+256 726 978988)</a>' +
            '<a class="fs-btn-outline-light" href="tel:' + escapeHtml(momoRaw) + '">📞 Call ' + momoNum + ' (' + momoName + ')</a>' +
            '<a class="fs-btn-outline-light" href="' + portfolioUrl + '" target="_blank" rel="noopener">🌐 View Freca E-Services Portfolio</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      renderModalHtml(site, cfg);

    updateCheckoutCalculations();
    var btn = document.getElementById("fs-expired-open-checkout");
    if (btn) {
      btn.addEventListener("click", function () {
        openCheckoutModal("Reactivate " + (site.name || "Your Website") + " immediately with your first installment or full payment.");
      });
    }
    var modal = document.getElementById("fs-preview-modal");
    var closeBtn = document.getElementById("fs-modal-close-btn");
    var closeX = document.getElementById("fs-modal-x-btn");
    if (closeBtn && modal) closeBtn.addEventListener("click", function () { modal.classList.remove("fs-open"); });
    if (closeX && modal) closeX.addEventListener("click", function () { modal.classList.remove("fs-open"); });
  }

  function renderPausedInstallmentScreen(site, cfg) {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    var root = ensureRoot();
    var bizName = escapeHtml(site.name || "Your Business");
    var momoNum = escapeHtml((cfg && cfg.momo_number) || "0758 991506");
    var momoRaw = String((cfg && cfg.momo_number) || "0758991506").replace(/\s+/g, "");
    var momoName = escapeHtml((cfg && cfg.momo_name) || "FREDRICK MUGAMBE");
    var portfolioUrl = escapeHtml((cfg && cfg.portfolio_url) || "https://frecae-services.github.io/Profile/");
    var frecaWa = (cfg && cfg.freca_wa) || "256726978988";
    var resumeUrl =
      "https://wa.me/" +
      frecaWa +
      "?text=" +
      encodeURIComponent(
        "Hi Freca E-Services! I have completed my scheduled installment for " +
          (site.name || "my business") +
          ". Please restore live customer ordering on my website."
      );

    document.body.style.overflow = "hidden";
    root.innerHTML =
      '<div class="fs-full-lock" role="alertdialog" aria-modal="true">' +
        '<div class="fs-lock-card">' +
          '<div class="fs-lock-icon">🔒</div>' +
          '<span class="fs-lock-sub">' + bizName + '</span>' +
          '<h1>🔒 Website Temporarily Paused — Pending Scheduled Installment with Freca E-Services</h1>' +
          '<p>To restore live customer ordering immediately, complete your scheduled installment via Mobile Money (<strong>' + momoNum + ' — ' + momoName + '</strong>) or contact Freca E-Services.</p>' +
          '<div class="fs-lock-pricing">' +
            '<div>📲 <strong>Mobile Money Number:</strong> ' + momoNum + '</div>' +
            '<div>👤 <strong>Registered Name:</strong> ' + momoName + '</div>' +
            '<div>⚡ <strong>Instant Restoration:</strong> Your live WhatsApp ordering buttons are restored as soon as your installment is confirmed.</div>' +
          '</div>' +
          '<div class="fs-lock-btns">' +
            '<a class="fs-btn-primary" href="' + escapeHtml(resumeUrl) + '" target="_blank" rel="noopener">💬 Confirm Installment on WhatsApp (+256 726 978988)</a>' +
            '<a class="fs-btn-outline-light" href="sms:+256758991506?body=' + encodeURIComponent("Hi Freca E-Services, I have sent my installment for " + (site.name || "my website") + ". Please restore my link.") + '">📩 Send Installment Confirmation via SMS (' + momoNum + ')</a>' +
            '<a class="fs-btn-outline-light" href="tel:' + escapeHtml(momoRaw) + '">📞 Call ' + momoNum + ' (' + momoName + ')</a>' +
            '<a class="fs-btn-outline-light" href="' + portfolioUrl + '" target="_blank" rel="noopener">🌐 View Freca E-Services Portfolio</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function extractOrderMessageFromLink(anchor, site) {
    var href = anchor.getAttribute("href") || "";
    if (href.indexOf("tel:") === 0) {
      return "Direct customer phone call to " + href.replace(/^tel:/i, "") + " (" + (anchor.textContent || "Call button").trim() + ")";
    }
    try {
      var u = new URL(href, window.location.href);
      var txt = u.searchParams.get("text");
      if (txt) return txt;
    } catch (e) {}
    var label = (anchor.textContent || "").replace(/\s+/g, " ").trim();
    return "Customer tapped [" + (label || "Order on WhatsApp") + "] → sends order to " + formatPhone(site && site.owner_wa);
  }

  function bindInterceptors() {
    if (state.interceptorBound) return;
    state.interceptorBound = true;

    document.addEventListener(
      "click",
      function (ev) {
        if (!state.site) return;
        if (ev.target && ev.target.closest && ev.target.closest("#freca-shield-root")) return;
        if (ev.target && ev.target.closest && ev.target.closest(".fs-card-lock-badge")) return;

        var link = ev.target && ev.target.closest && ev.target.closest("a[href]");
        if (!link) return;

        var decision = classifyLinkAction(link, state.site);
        if (decision.allowed) return;

        ev.preventDefault();
        ev.stopPropagation();
        if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();

        var orderMsg = extractOrderMessageFromLink(link, state.site);
        var fullNotice = decision.reason ? decision.reason + " | Triggered: " + orderMsg : orderMsg;
        var prefMode = decision.nextStage === 50 ? "monthly_50" : decision.nextStage === 75 ? "full_100" : null;
        openCheckoutModal(fullNotice, prefMode);
      },
      true
    );

    document.addEventListener(
      "submit",
      function (ev) {
        if (!state.site || state.site.unlock_stage >= 2) return;
        if (ev.target && ev.target.closest && ev.target.closest("#freca-shield-root")) return;
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();

        openCheckoutModal("Customer submitted checkout order form on " + (state.site.name || "your website"));
      },
      true
    );
  }

  function applyShield(cfg) {
    state.config = cfg || FALLBACK_CONFIG;
    state.site = resolveSite(state.config);
    var status = state.site.status || "preview";
    var stage = Number(state.site.unlock_stage) || 0;

    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }

    if (status === "active_paid" || status === "portfolio" || stage >= 4) {
      var existing = document.getElementById("freca-shield-root");
      if (existing) existing.innerHTML = "";
      decorateStageCards({ unlock_stage: 4 });
      document.body.style.overflow = "";
      return;
    }

    if (status === "paused_installment") {
      renderPausedInstallmentScreen(state.site, state.config);
      return;
    }

    if (status === "expired") {
      renderExpiredScreen(state.site, state.config);
      return;
    }

    // Stages 1, 2, 3 (25%, 50%, 75% Paid): No 72-hour expiration timer!
    if (stage >= 1 && stage <= 3) {
      document.body.style.overflow = "";
      renderMainUI(state.site, state.config);
      bindInterceptors();
      return;
    }

    // Stage 0 ("preview"): 72-hour countdown active
    var deadline = getDeadlineMs(state.site, state.config.default_preview_hours);
    var remaining = deadline - Date.now();
    if (remaining <= 0) {
      renderExpiredScreen(state.site, state.config);
      return;
    }

    document.body.style.overflow = "";
    renderMainUI(state.site, state.config);
    bindInterceptors();

    var updateClock = function () {
      var rem = deadline - Date.now();
      if (rem <= 0) {
        renderExpiredScreen(state.site, state.config);
        return;
      }
      var el = document.getElementById("fs-countdown-text");
      if (el) el.textContent = formatRemaining(rem);
    };
    updateClock();
    state.timerId = setInterval(updateClock, 1000);
  }

  function init() {
    applyShield(FALLBACK_CONFIG);
    var url = getConfigUrl();
    if (typeof fetch === "function") {
      fetch(url, { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (remoteCfg) {
          if (remoteCfg && remoteCfg.sites) {
            applyShield(remoteCfg);
          }
        })
        .catch(function () {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
