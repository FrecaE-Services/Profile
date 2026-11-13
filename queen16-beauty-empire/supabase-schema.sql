-- Queen16 Beauty Empire store schema
-- Run once in the Supabase SQL editor.
-- Before running, replace queen16.admin@example.com with the real admin user's email.
-- That email must match ADMIN_EMAIL in assets/config.js.

create or replace function public.queen16_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(lower(auth.jwt()->>'email'),'') = 'queen16.admin@example.com'
$$;

create table if not exists public.queen16_categories(
  slug text primary key,
  name text not null,
  blurb text default '',
  sort int default 0,
  hidden boolean default false
);
create table if not exists public.queen16_products(
  id text primary key,
  name text not null,
  category text references public.queen16_categories(slug) on update cascade,
  sub text default '',
  price bigint,
  old_price bigint,
  show_old_price boolean default false,
  description text default '',
  badge text default '',
  images jsonb default '[]'::jsonb,
  stock int,
  hidden boolean default false,
  featured boolean default false,
  sort int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.queen16_settings(
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
create table if not exists public.queen16_orders(
  id text primary key,
  created_at timestamptz default now(),
  customer_name text not null,
  customer_phone text not null,
  location text not null,
  notes text,
  items jsonb not null,
  total bigint default 0,
  status text not null default 'new' check (status in ('new','confirmed','delivered','cancelled'))
);

alter table public.queen16_categories enable row level security;
alter table public.queen16_products  enable row level security;
alter table public.queen16_settings  enable row level security;
alter table public.queen16_orders    enable row level security;

drop policy if exists queen16_cat_read on public.queen16_categories;
drop policy if exists queen16_prod_read on public.queen16_products;
drop policy if exists queen16_set_read on public.queen16_settings;
drop policy if exists queen16_order_insert on public.queen16_orders;
drop policy if exists queen16_cat_admin on public.queen16_categories;
drop policy if exists queen16_prod_admin on public.queen16_products;
drop policy if exists queen16_set_admin on public.queen16_settings;
drop policy if exists queen16_order_admin_read on public.queen16_orders;
drop policy if exists queen16_order_admin_upd on public.queen16_orders;
drop policy if exists queen16_order_admin_del on public.queen16_orders;

create policy queen16_cat_read  on public.queen16_categories for select using (not hidden or public.queen16_is_admin());
create policy queen16_prod_read on public.queen16_products  for select using (not hidden or public.queen16_is_admin());
create policy queen16_set_read  on public.queen16_settings  for select using (true);
create policy queen16_order_insert on public.queen16_orders for insert to anon, authenticated
  with check (status = 'new'
    and length(customer_name) between 1 and 120
    and length(customer_phone) between 9 and 30
    and length(location) between 1 and 200
    and jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) between 1 and 100);
create policy queen16_cat_admin  on public.queen16_categories for all to authenticated using (public.queen16_is_admin()) with check (public.queen16_is_admin());
create policy queen16_prod_admin on public.queen16_products  for all to authenticated using (public.queen16_is_admin()) with check (public.queen16_is_admin());
create policy queen16_set_admin  on public.queen16_settings  for all to authenticated using (public.queen16_is_admin()) with check (public.queen16_is_admin());
create policy queen16_order_admin_read on public.queen16_orders for select to authenticated using (public.queen16_is_admin());
create policy queen16_order_admin_upd  on public.queen16_orders for update to authenticated using (public.queen16_is_admin()) with check (public.queen16_is_admin());
create policy queen16_order_admin_del  on public.queen16_orders for delete to authenticated using (public.queen16_is_admin());

insert into public.queen16_categories(slug,name,blurb,sort,hidden) values ('skincare','Skincare','Cleansers, serums, moisturizers and sunscreen for a calm, lit-from-within routine.',1,false) on conflict (slug) do nothing;
insert into public.queen16_categories(slug,name,blurb,sort,hidden) values ('body','Body Care','Lotions, washes, oils and scrubs that stay comfortable in Kampala weather.',2,false) on conflict (slug) do nothing;
insert into public.queen16_categories(slug,name,blurb,sort,hidden) values ('perfume','Perfumes','Fragrances for her and for him, from a soft skin musk to a deeper oud.',3,false) on conflict (slug) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('glass-dew-gel-cleanser','Glass Dew Gel Cleanser','skincare','cleansers',42000,null,false,'A clear 150 ml gel that lifts the day’s dust and sunscreen without leaving skin tight. A first step for combination and oily skin.','','["images/gel-hands.jpg"]'::jsonb,null,false,false,1) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('rice-enzyme-foam','Rice Enzyme Foam Wash','skincare','cleansers',38000,null,false,'A soft 120 ml foam with rice enzymes, for a smooth, freshly washed feel. Use it morning and night.','','["images/tubes-beige.jpg"]'::jsonb,null,false,false,2) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('midnight-cleansing-balm','Midnight Cleansing Balm','skincare','cleansers',68000,null,false,'An 80 ml balm that melts makeup and sunscreen, then rinses away. The first cleanse on a night out.','House pick','["images/black-jar.jpg"]'::jsonb,null,false,true,3) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('centella-calm-wash','Centella Calm Wash','skincare','cleansers',45000,null,false,'A low-foam 150 ml wash with centella, for skin that flushes easily. It leaves the face comfortable, not stripped.','','["images/white-tube.jpg"]'::jsonb,null,false,false,4) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('niacinamide-glow-serum','Niacinamide Glow Serum','skincare','serums',78000,null,false,'A watery 30 ml serum with 10% niacinamide, for a more even look. Press it on and follow with moisturizer.','Popular','["images/dropper-hand.jpg"]'::jsonb,null,false,true,5) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('vitamin-c-bright-drops','Vitamin C Bright Drops','skincare','serums',85000,98000,true,'A 30 ml morning serum for a brighter look. Pat it on, then sunscreen. Keep the bottle out of harsh sun.','','["images/amber-dropper.jpg"]'::jsonb,null,false,true,6) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('hyaluronic-dew-ampoule','Hyaluronic Dew Ampoule','skincare','serums',72000,null,false,'A light 50 ml ampoule layered on damp skin so makeup sits more smoothly through a Kampala afternoon.','','["images/serum-linen.jpg"]'::jsonb,null,false,false,7) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('retinol-night-repair','Retinol Night Repair','skincare','serums',96000,null,false,'A 30 ml night serum for the look of fine lines. Use it two or three evenings a week and always follow with moisturizer. Ask us before use in pregnancy.','','["images/serum-leaf.jpg"]'::jsonb,3,false,false,8) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('snail-mucin-essence','Snail Mucin Essence','skincare','serums',64000,null,false,'A slippy 100 ml Korean-style essence, the layer people use for a glass-skin finish. Apply it on damp skin.','Popular','["images/amber-set.jpg"]'::jsonb,null,false,true,9) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('peptide-jade-set','Peptide Serum & Jade Roller','skincare','serums',110000,null,false,'A 30 ml peptide serum and a cooling jade roller for the cheeks and jawline. An unhurried evening step.','New','["images/jade-roller.jpg"]'::jsonb,null,false,false,10) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('ceramide-barrier-cream','Ceramide Barrier Cream','skincare','moisturizers',74000,null,false,'A cushiony 50 ml cream that seals the routine and comforts dry patches around the nose and mouth.','','["images/cream-set.jpg"]'::jsonb,null,false,false,11) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('water-gel-moisturizer','Water-Gel Moisturizer','skincare','moisturizers',58000,null,false,'A cool 50 ml gel cream for humid days. It sinks in under sunscreen and does not sit on the skin.','','["images/cream-jars.jpg"]'::jsonb,null,false,true,12) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('rich-night-cream','Rich Night Repair Cream','skincare','moisturizers',89000,null,false,'A denser 50 ml night cream for skin that feels tight after cleansing. Warm a little between the fingers first.','','["images/open-jar.jpg"]'::jsonb,null,false,false,13) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('gold-eye-contour','Gold Eye Contour Cream','skincare','moisturizers',65000,null,false,'A 15 ml jar for the eye area. Tap it on with a fingertip, morning and night. Do not tug the skin.','','["images/cream-texture.jpg"]'::jsonb,null,false,false,14) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('daily-uv-shield','Daily UV Shield SPF 50','skincare','sunscreen',52000,null,false,'A 50 ml daily sunscreen for the face and neck. The step that keeps the rest of the routine honest under Kampala sun.','','["images/bottles-stone.jpg"]'::jsonb,null,false,true,15) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('tone-up-sunscreen','Tone-Up Sunscreen SPF 50+','skincare','sunscreen',61000,null,false,'A 40 ml tone-up fluid that evens the look of the skin without a heavy mask. Reapply if you are out through midday.','','["images/apply-serum.jpg"]'::jsonb,null,false,false,16) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('invisible-fluid-spf','Invisible Fluid SPF 50','skincare','sunscreen',48000,null,false,'A thin 50 ml fluid made to sit under makeup and not leave a white cast on deeper skin tones.','','["images/cotton-pad.jpg"]'::jsonb,null,false,false,17) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('shea-velvet-lotion','Shea Velvet Body Lotion','body','lotions',36000,null,false,'A fast 250 ml shea lotion for arms and legs, straight after a shower while the skin is still damp.','','["images/foot-cream.jpg"]'::jsonb,null,false,false,18) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('cocoa-glow-lotion','Cocoa Butter Glow Lotion','body','lotions',42000,null,false,'A richer 200 ml cocoa butter lotion for dry shins, elbows and heels. A little goes a long way.','Popular','["images/hand-cream.jpg"]'::jsonb,null,false,true,19) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('oat-calm-lotion','Oat Calm Body Lotion','body','lotions',34000,null,false,'A 250 ml oat lotion for skin that feels tight after the sun or a long day in town.','','["images/body-apply.jpg"]'::jsonb,null,false,false,20) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('gold-dust-lotion','Gold Dust Shimmer Lotion','body','lotions',48000,55000,true,'A 150 ml lotion with a light golden sheen for collarbones and shoulders. Evening wear, not an everyday moisturizer.','New','["images/flatlay-copper.jpg"]'::jsonb,null,false,false,21) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('neroli-body-wash','Neroli Body Wash','body','body-wash',32000,null,false,'A creamy 300 ml wash with a soft orange-blossom scent. Rinse, then lock it in with lotion.','','["images/ritual-soap.jpg"]'::jsonb,null,false,false,22) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('charcoal-body-wash','Charcoal Detox Body Wash','body','body-wash',29000,null,false,'A 250 ml charcoal wash for the back and shoulders. Rinse well so nothing drying is left behind.','','["images/soap-grey.jpg"]'::jsonb,null,false,false,23) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('rose-milk-wash','Rose Milk Body Wash','body','body-wash',35000,null,false,'A milky 300 ml rose wash that leaves the skin lightly scented, ready for lotion or a fragrance.','','["images/soap-marbled.jpg"]'::jsonb,null,false,false,24) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('coffee-sugar-scrub','Coffee Sugar Body Scrub','body','oils-scrubs',39000,null,false,'A 200 g sugar scrub with coffee, for smooth arms and legs. Once or twice a week, then lotion.','','["images/soap-wood.jpg"]'::jsonb,null,false,false,25) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('argan-body-oil','Argan Body Oil','body','oils-scrubs',54000,null,false,'A 100 ml oil. A few drops on damp skin seal in lotion. The same oil smooths the ends of hair.','','["images/oil-tray.jpg"]'::jsonb,null,false,false,26) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('beechwood-dry-brush','Beechwood Dry Brush','body','oils-scrubs',28000,null,false,'A firm dry brush used on dry skin before the shower, in long strokes toward the heart. Follow with lotion.','','["images/dry-brush.jpg"]'::jsonb,null,false,false,27) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('noir-velvet','Noir Velvet Eau de Parfum','perfume','women',145000,null,false,'50 ml. A deep floral with vanilla and a soft smoky finish. One spray at the wrist is enough for the evening.','Popular','["images/black-bottle.jpg"]'::jsonb,null,false,true,28) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('queen-rose','Queen Rose Absolute','perfume','women',165000,null,false,'50 ml. Rose, a little powder, and a warm base. The signature style of the counter.','House pick','["images/perfume-stool.jpg"]'::jsonb,4,false,true,29) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('jasmine-midnight','Jasmine Midnight','perfume','women',128000,null,false,'50 ml. Night jasmine and white musk. Light enough for the day, present enough for dinner.','','["images/lavender-oil.jpg"]'::jsonb,null,false,false,30) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('soft-musk-veil','Soft Musk Veil','perfume','women',98000,null,false,'30 ml. A clean skin musk you can wear every day, on skin or on a scarf.','','["images/minimal-bottles.jpg"]'::jsonb,null,false,false,31) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('citrus-crown','Citrus Crown','perfume','men',135000,null,false,'50 ml. Bergamot, lemon leaf and a dry woody base. Fresh for the morning and still polite by afternoon.','','["images/wash-bottles.jpg"]'::jsonb,null,false,false,32) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('oud-ember','Oud Ember','perfume','men',185000,null,false,'50 ml. A restrained oud with amber. In Kampala heat, one spray is the whole story.','House pick','["images/perfume-dark.jpg"]'::jsonb,null,false,true,33) on conflict (id) do nothing;
insert into public.queen16_products(id,name,category,sub,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('cedar-smoke','Cedar & Smoke','perfume','men',155000,null,false,'50 ml. Cedarwood, a thread of smoke, and clean musk. Smart enough for a meeting, easy enough for the weekend.','','["images/hair-oil.jpg"]'::jsonb,null,false,false,34) on conflict (id) do nothing;
insert into public.queen16_settings(key,value) values ('site','{"whatsapp":"256700888511","phone_display":"+256 700 888511","announcement":"","hero_kicker":"GGS Plaza 2, Kampala","hero_title":"Care, chosen with a crown.","hero_text":"Queen16 Beauty Empire deals in skincare, body care and perfume. Korean glass-skin formulas, rich body care, and fragrances for her and for him — priced in Ugandan shillings and ordered on WhatsApp.","hero_image":"images/portrait.jpg","about_title":"A Kampala counter for the whole ritual","about":"Queen16 Beauty Empire is a beauty counter at GGS Plaza 2 in Kampala. The shelf is built for ordinary mornings and for the evenings you dress up: gentle cleansers, serums and moisturizers, sunscreen for equatorial sun, lotions and body washes, and a perfume edit for women and men.\n\nMuch of the skincare follows a Korean routine — watery layers, the kind of glass-skin care people look for in Medicube-style lines. Stock moves with what arrives, so treat these prices as the sample shelf. Message us on WhatsApp and we will confirm what is in the shop today.","why_title":"Why shop with us","why":[{"t":"One counter, three rituals","d":"Skincare, body care and perfume without crossing town. Ask us to build a routine around the skin you actually have."},{"t":"Kampala, on WhatsApp","d":"Order from your phone. We confirm the pieces, then arrange delivery or pickup at GGS Plaza 2."},{"t":"Prices in shillings","d":"Every piece on this shelf shows a UGX price, so you can plan the bag before you write to us."},{"t":"Help choosing","d":"Tell us your skin concern or the scent you like. We reply on +256 700 888511."}],"visit_title":"Visit or write to us","address":"GGS Plaza 2, Kampala, Uganda","hours_note":"Ask on WhatsApp for today’s opening hours.","delivery_info":"Pickup is at GGS Plaza 2. Delivery across Kampala is arranged once we confirm your order on WhatsApp.","contact":"GGS Plaza 2, Kampala, Uganda\nWhatsApp / call: +256 700 888511\nPickup at the shop, or delivery arranged after we confirm the order.","footer":"© 2026 Queen16 Beauty Empire","sample_note":"Concept sample prepared by Freca E-Services. The photographs are freely licensed stock images, not pictures of the products on the shelf. Wording and prices may be revised."}'::jsonb) on conflict (key) do nothing;
