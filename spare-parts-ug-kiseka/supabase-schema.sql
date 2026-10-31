-- SPARE PARTS UG store schema (run once in Supabase SQL Editor)
-- Admin = the Supabase Auth user with this email:
create or replace function public.sparepartsug_is_admin() returns boolean
language sql stable as $$ select coalesce(lower(auth.jwt()->>'email'),'') = 'sparepartsug112@gmail.com' $$;

create table if not exists public.sparepartsug_categories(
  slug text primary key, name text not null, sort int default 0, hidden boolean default false);
create table if not exists public.sparepartsug_products(
  id text primary key, name text not null, category text references public.sparepartsug_categories(slug) on update cascade,
  price bigint, old_price bigint, show_old_price boolean default false, description text default '', badge text default '',
  images jsonb default '[]'::jsonb, stock int, hidden boolean default false, featured boolean default false, sort int default 0,
  created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.sparepartsug_settings(key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz default now());
create table if not exists public.sparepartsug_orders(
  id text primary key, created_at timestamptz default now(),
  customer_name text not null, customer_phone text not null, location text not null, car text, notes text,
  payment_method text not null check (payment_method in ('cod','momo')),
  items jsonb not null, total bigint default 0,
  status text not null default 'new' check (status in ('new','confirmed','delivered','cancelled')));

alter table public.sparepartsug_categories enable row level security;
alter table public.sparepartsug_products  enable row level security;
alter table public.sparepartsug_settings  enable row level security;
alter table public.sparepartsug_orders    enable row level security;

-- Public: read visible catalogue + settings
create policy spu_cat_read  on public.sparepartsug_categories for select using (not hidden or public.sparepartsug_is_admin());
create policy spu_prod_read on public.sparepartsug_products  for select using (not hidden or public.sparepartsug_is_admin());
create policy spu_set_read  on public.sparepartsug_settings  for select using (true);
-- Public: insert new orders only (cannot read, edit or delete)
create policy spu_order_insert on public.sparepartsug_orders for insert to anon, authenticated
  with check (status = 'new' and length(customer_name) between 1 and 120 and length(customer_phone) between 9 and 30
              and jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 100);
-- Admin: full control
create policy spu_cat_admin  on public.sparepartsug_categories for all to authenticated using (public.sparepartsug_is_admin()) with check (public.sparepartsug_is_admin());
create policy spu_prod_admin on public.sparepartsug_products  for all to authenticated using (public.sparepartsug_is_admin()) with check (public.sparepartsug_is_admin());
create policy spu_set_admin  on public.sparepartsug_settings  for all to authenticated using (public.sparepartsug_is_admin()) with check (public.sparepartsug_is_admin());
create policy spu_order_admin_read on public.sparepartsug_orders for select to authenticated using (public.sparepartsug_is_admin());
create policy spu_order_admin_upd  on public.sparepartsug_orders for update to authenticated using (public.sparepartsug_is_admin()) with check (public.sparepartsug_is_admin());
create policy spu_order_admin_del  on public.sparepartsug_orders for delete to authenticated using (public.sparepartsug_is_admin());

-- Seed data
insert into public.sparepartsug_categories(slug,name,sort,hidden) values ('radios','Android / CarPlay Radios',1,false) on conflict (slug) do nothing;
insert into public.sparepartsug_categories(slug,name,sort,hidden) values ('body','Car Body Parts',2,false) on conflict (slug) do nothing;
insert into public.sparepartsug_categories(slug,name,sort,hidden) values ('security','Security Systems',3,false) on conflict (slug) do nothing;
insert into public.sparepartsug_categories(slug,name,sort,hidden) values ('facelift','Facelift Body Kits',4,false) on conflict (slug) do nothing;
insert into public.sparepartsug_products(id,name,category,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('prado-fj150-radio','Prado FJ150 9" Android Radio','radios',null,null,false,'9-inch Android touchscreen head unit made for the Prado FJ150. Wireless CarPlay & Android Auto, GPS navigation, Bluetooth calls, reverse camera input and steering-wheel control support. Direct-fit frame — no cutting.','Popular','["https://images.unsplash.com/photo-1648892936786-de40bb1080a6?w=900&auto=format&fit=crop&q=80"]'::jsonb,null,false,true,1) on conflict (id) do nothing;
insert into public.sparepartsug_products(id,name,category,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('markx-radio','Mark X 2010–2023 9" Radio','radios',null,null,false,'9-inch Android radio for Toyota Mark X (2010–2023). CarPlay / Android Auto, YouTube & maps over Wi-Fi or hotspot, Bluetooth, USB and reverse camera support.','','["https://images.unsplash.com/photo-1648892936786-de40bb1080a6?w=900&auto=format&fit=crop&q=80&sat=-20"]'::jsonb,null,false,false,2) on conflict (id) do nothing;
insert into public.sparepartsug_products(id,name,category,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('forester-lamps','Subaru Forester Headlamps / Taillights','body',null,null,false,'Headlamps and taillights for Subaru Forester. Tell us your model year so we confirm the exact fit before you pay.','In Stock','["https://images.unsplash.com/photo-1557775209-a640976a712f?w=900&auto=format&fit=crop&q=80"]'::jsonb,null,false,true,3) on conflict (id) do nothing;
insert into public.sparepartsug_products(id,name,category,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('hilux-vigo-lamps','Hilux Vigo Headlamps / Rearlamps','body',null,null,false,'Headlamps and rear lamps for Toyota Hilux Vigo. Available as single side or pair.','','["https://images.unsplash.com/photo-1557775209-a640976a712f?w=900&auto=format&fit=crop&q=80&sat=-40"]'::jsonb,null,false,false,4) on conflict (id) do nothing;
insert into public.sparepartsug_products(id,name,category,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('keyless-entry','Keyless Entry System','security',null,null,false,'Keyless entry with remote lock/unlock and alarm. Fitting available at our shop.','','["https://images.unsplash.com/photo-1710006548781-eff5670376fa?w=900&auto=format&fit=crop&q=80"]'::jsonb,null,false,false,5) on conflict (id) do nothing;
insert into public.sparepartsug_products(id,name,category,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('gps-tracker','Car GPS Tracker','security',null,null,false,'Real-time GPS tracking on your phone, engine cut-off and movement alerts. Ideal for personal cars, taxis and fleets.','Order Now','["https://images.unsplash.com/photo-1710006548781-eff5670376fa?w=900&auto=format&fit=crop&q=80&sat=-30"]'::jsonb,null,false,true,6) on conflict (id) do nothing;
insert into public.sparepartsug_products(id,name,category,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('lc-v8-facelift','Landcruiser V8 Facelift Kit','facelift',null,null,false,'Complete facelift kit to give your Land Cruiser V8 the latest look: bumper, grille and lamps.','','["https://images.unsplash.com/photo-1557775209-a640976a712f?w=900&auto=format&fit=crop&q=80&hue=200"]'::jsonb,null,false,false,7) on conflict (id) do nothing;
insert into public.sparepartsug_products(id,name,category,price,old_price,show_old_price,description,badge,images,stock,hidden,featured,sort) values ('markx-bumper','Mark X Facelift Front Bumper','facelift',null,null,false,'Facelift front bumper for Toyota Mark X. Primed and ready for spraying.','','["https://images.unsplash.com/photo-1557775209-a640976a712f?w=900&auto=format&fit=crop&q=80&hue=280"]'::jsonb,null,false,false,8) on conflict (id) do nothing;
insert into public.sparepartsug_settings(key,value) values ('site','{"whatsapp":"256774188097","announcement":"","hero_tag":"No.1 Automotive Spare Parts Mega Store","hero_title":"Your Reliable Auto Parts Partner.","hero_text":"Car facelifting, body parts, Android radios, security systems, and every accessory in between — genuine parts, fitted to your exact model.","hero_image":"https://images.unsplash.com/photo-1648892936786-de40bb1080a6?w=1200&auto=format&fit=crop&q=80","strip_location":"William Street, Kampala","phones":"0774 188097 / 0752 127553","hours":"Open 8:30 AM – 6:00 PM","why_title":"Why Spare Parts UG","why":[{"t":"Model-Specific Fit","d":"Radios and parts listed by exact make, model, and year — no guesswork."},{"t":"3,000+ Followers Strong","d":"A trusted name across Kampala for facelifts, body parts, and upgrades."},{"t":"One Stop Shop","d":"From headlamps to GPS trackers — everything your car needs, in one place."}],"about":"Your reliable auto parts partner for quality car parts, facelifts, and accessories.","contact":"William Street, Kampala, Uganda\nCall / WhatsApp: 0774 188097 / 0752 127553\nOpen Mon–Sat, 8:30 AM – 6:00 PM","footer":"© 2026 Spare Parts UG","delivery_info":"Delivery within Kampala is arranged after we confirm your order. Upcountry orders go by bus/courier. Pick-up is free at our shop.","momo_instructions":"After we confirm stock and price on WhatsApp, send the payment by Mobile Money to the number we share in the chat, then send us the transaction ID.","cod_instructions":"Pay cash when your part is delivered or when you pick it up at the shop.","price_note":"Contact for price"}'::jsonb) on conflict (key) do nothing;
