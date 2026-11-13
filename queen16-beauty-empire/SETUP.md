# Queen16 Beauty Empire: live store

Live shop: https://frecae-services.github.io/Profile/queen16-beauty-empire/
Admin: https://frecae-services.github.io/Profile/queen16-beauty-empire/admin/

## What is connected
- **Database:** Supabase project `dubcicwpeprauojkwqin` (queen16-beauty-empire, eu-central-1, free plan). Tables `queen16_categories`, `queen16_subcategories`, `queen16_products`, `queen16_settings`, `queen16_orders`, with row level security on all of them. `supabase-schema.sql` shows the full setup. `supabase-seed-products.sql` is the starting 48 products.
- **Admin login:** Supabase Auth email + password. The admin email is `queen16beautyempire0@gmail.com`. The password is kept privately by Freca E-Services. Only that account can edit, and other sign-ups are blocked in the database.
- **Photos:** Cloudinary, cloud `lgjllewt`, unsigned preset `frecary`, folder `queen16-beauty-empire`. Uploading from the admin panel puts photos there.
- `assets/config.js` holds the project URL and the public publishable key only. Never put a secret or service_role key in this folder.

## Pay-first checkout (manual Mobile Money)
1. The customer fills the bag and enters their name, phone and delivery location.
2. The database prices the bag from the products table and creates an order such as `Q16-1001` with the status **Not paid yet**.
3. The customer sees the order number, the total and the Mobile Money number (**Site settings → Mobile Money number**, now 0700888511).
4. After paying, they enter the transaction ID. The order changes to **Waiting for confirmation**, and the WhatsApp button unlocks with the order number, items, total and transaction ID filled in.
5. In **Admin → Orders**, she checks her MoMo SMS, presses **Mark as Paid**, and later **Mark as Delivered**.

## Estimated prices
Products with `price_confirmed = false` show normally on the shop. In the admin they carry an **Estimated price** label, and you can filter to them with "Show only estimated prices". When she edits the price, "Price confirmed" is ticked automatically.

## Keep-alive
Supabase free projects pause after about 7 days with no activity. Open the shop or admin every 3 to 4 days, or upgrade the project.
