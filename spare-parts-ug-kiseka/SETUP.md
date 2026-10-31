# SPARE PARTS UG — going live

The store works today in **preview mode**: it shows the built-in catalogue, checkout still goes to WhatsApp, and the admin is locked. To turn on the admin, saved orders and edits:

1. Create a free Supabase project at https://supabase.com (region: closest to Uganda, e.g. eu-west / af-south if offered).
2. SQL Editor → paste all of `supabase-schema.sql` → Run. This creates the tables, the security rules (RLS) and the starting products.
3. Authentication → Users → **Add user** → email `sparepartsug112@gmail.com` and the password kept privately by Freca E-Services, then tick **Auto Confirm User**.
   Authentication → Sign In / Providers → turn **off** "Allow new users to sign up".
4. Project Settings → API → copy the **Project URL** and the **anon public** key into `assets/config.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`). Never use the service_role key here.
5. Deploy `index.html`, `assets/`, `admin/` to GitHub Pages. Admin: `/spare-parts-ug-kiseka/admin/`.

Images upload to Cloudinary (cloud `lgjllewt`, unsigned preset `frecary`).
