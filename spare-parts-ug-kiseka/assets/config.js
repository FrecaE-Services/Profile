/* SPARE PARTS UG store configuration.
   Fill SUPABASE_URL + SUPABASE_ANON_KEY (public anon key, safe to publish) after running supabase-schema.sql.
   While blank, the store runs in PREVIEW mode: products come from the built-in catalogue,
   orders are still sent to WhatsApp, and the admin dashboard is locked. */
window.SPU_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  ADMIN_EMAIL: "sparepartsug112@gmail.com",
  CLOUDINARY_CLOUD: "lgjllewt",
  CLOUDINARY_PRESET: "frecary"
};
