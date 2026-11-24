# American Home Goods: online shop (self-managed)

Shop: `<site>/`   Admin: `<site>/admin/`
Today: https://frecae-services.github.io/Profile/american-home-goods/ · Later: https://americanhomegoods.com/

## How it fits together
- **Shop** (`index.html`, `assets/shop.js`): products, categories, search, product pages (`#product-<id>` links you can share), and WhatsApp ordering to the number in Shop info (default 256751148170).
- **Admin** (`admin/`): log in, add / edit / delete / hide products (name, UGX price, condition, description, details, category, photos, in stock or out of stock), manage categories, and edit Shop info (WhatsApp, phone, hours, location, notice bar). Built for phones.
- **Data** (`assets/store.js`): Supabase tables `ahg_categories`, `ahg_products`, `ahg_settings`, with row level security. Anyone can read what is not hidden; only the admin email can write.
- **Photos**: uploads from the admin go to Cloudinary (cloud `lgjllewt`, unsigned preset `frecary`, folder `american-home-goods`). The starting 50 products use the photos in `images/`.
- All paths are relative, so the same folder works under `/Profile/american-home-goods/` or at the root of americanhomegoods.com. Nothing needs changing when the domain moves.

## Connecting the database (one time)
1. Create the Supabase project (free plan).
2. Run `supabase/schema.sql`, then `supabase/seed.sql` (4 categories, 50 products).
3. If the project is used ONLY by this shop, also run `supabase/block-signups.sql`.
4. Create the admin login (private SQL kept by Freca E-Services; only a bcrypt hash).
5. Put the project URL and the **publishable** key into `assets/config.js`. Never a secret key.

Until step 5, the shop shows the starting products from `assets/seed.json` (read only) and the admin says the database is not connected.

## Admin login
Email `admin@americanhomegoods.com`. The password is kept privately by Freca E-Services.

## Keep-alive
Supabase free projects pause after about 7 days with no visits. Normal shop traffic keeps it awake.
