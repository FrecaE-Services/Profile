# Queen16 Beauty Empire — going live

The shop works today in **preview mode**. Supabase URL and anon key in `assets/config.js` are blank, so the shelf comes from `assets/products.js`. Search, the bag and WhatsApp checkout already work. The admin stays locked on the public site until the database is connected.

Photos in `images/` are freely licensed stock (see `image-credits.json`). They illustrate the shelf. They are not photographs of the products in GGS Plaza 2. Prices are a sample shelf and can be revised in the admin, or by editing `assets/products.js` while you are still in preview mode.

## 1. Supabase

1. Create a free project at https://supabase.com. Pick a region close to Uganda if one is offered.
2. Open the SQL editor, paste all of `supabase-schema.sql`, and run it. This creates the `queen16_` tables, row level security, and the starting shelf.
3. Before you run that file, replace `queen16.admin@example.com` inside `queen16_is_admin()` with the real admin email you will use.
4. Authentication → Users → Add user with that same email and a private password. Tick **Auto Confirm User**.
5. Authentication → Sign In / Providers → turn **off** “Allow new users to sign up”.
6. Project Settings → API. Copy the **Project URL** and the **anon public** key into `assets/config.js`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL` (the same email as in the SQL function)
7. Do not put the `service_role` key in this folder. The anon key is safe to publish because the security rules only let the admin change products and orders.

After a refresh, the shop reads products from Supabase. Orders placed on the site are also stored there, and the customer is still sent to WhatsApp to press Send. Admin: `https://frecae-services.github.io/Profile/queen16-beauty-empire/admin/`.

On your own computer, at `http://localhost`, you can sign in with any email and a password of at least 8 characters to try the admin against a copy kept in the browser. That local copy is not the public site.

## 2. Cloudinary (product photos)

Image upload in the admin uses an **unsigned** Cloudinary upload preset. Leave these blank until you have them:

- `CLOUDINARY_CLOUD` — the cloud name
- `CLOUDINARY_PRESET` — the unsigned upload preset name

Create the preset in the Cloudinary console (Settings → Upload → Upload presets → Unsigned). Restrict it to images if you can. Uploads are stored in the folder `queen16-beauty-empire`.

Until those two values are filled in, the admin will not upload a file. Paste an image link instead, or keep using the photos already in `images/`.

## 3. WhatsApp

Orders open `https://wa.me/256700888511` with the bag, quantities, prices and total. Change the number in the admin (Site settings → WhatsApp number) after Supabase is connected, or in `assets/products.js` → `settings.whatsapp` while you are in preview mode. Use the country code and no plus sign: `256700888511`.

## 4. Publish

The shop is a static folder. GitHub Pages serves it from the `main` branch at:

https://frecae-services.github.io/Profile/queen16-beauty-empire/

The sample timer is the same shield used by the other concept sites (`shield.js`, slug `queen16-beauty-empire`). It is a showcase: visitors can use the shop, including WhatsApp, for a few minutes, then the Freca E-Services sample screen appears.
