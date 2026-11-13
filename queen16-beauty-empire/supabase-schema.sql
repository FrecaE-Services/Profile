-- Queen16 Beauty Empire store schema (pay-first checkout)
-- Already applied to Supabase project dubcicwpeprauojkwqin. Kept here for reference / re-creating the database.
-- Products are seeded separately (see SETUP.md).
create extension if not exists pgcrypto with schema extensions;

create or replace function public.queen16_is_admin() returns boolean
language sql stable set search_path = '' as $$
  select coalesce(lower(auth.jwt()->>'email'),'') = 'queen16beautyempire0@gmail.com'
$$;

create table if not exists public.queen16_categories(
  slug text primary key, name text not null, blurb text default '', sort int default 0, hidden boolean default false);
create table if not exists public.queen16_subcategories(
  slug text primary key, name text not null,
  category text not null references public.queen16_categories(slug) on update cascade on delete cascade,
  sort int default 0, hidden boolean default false);
create table if not exists public.queen16_products(
  id text primary key, name text not null,
  category text references public.queen16_categories(slug) on update cascade,
  sub text default '', price bigint, old_price bigint, show_old_price boolean default false,
  price_confirmed boolean not null default true,
  description text default '', badge text default '', images jsonb default '[]'::jsonb,
  stock int, hidden boolean default false, featured boolean default false, sort int default 0,
  created_at timestamptz default now(), updated_at timestamptz default now());
create index if not exists queen16_products_category_idx on public.queen16_products(category);
create table if not exists public.queen16_settings(
  key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz default now());

create sequence if not exists public.queen16_order_seq start 1001;
create table if not exists public.queen16_orders(
  id text primary key,
  token uuid not null default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_name text not null, customer_phone text not null, location text not null, notes text,
  items jsonb not null, total bigint not null default 0,
  txn_id text, txn_submitted_at timestamptz, paid_at timestamptz,
  status text not null default 'awaiting_payment'
    check (status in ('awaiting_payment','waiting_confirmation','paid','delivered','cancelled')));

alter table public.queen16_categories    enable row level security;
alter table public.queen16_subcategories enable row level security;
alter table public.queen16_products      enable row level security;
alter table public.queen16_settings      enable row level security;
alter table public.queen16_orders        enable row level security;

create policy queen16_cat_read  on public.queen16_categories    for select to anon, authenticated using (not hidden or (select public.queen16_is_admin()));
create policy queen16_sub_read  on public.queen16_subcategories for select to anon, authenticated using (not hidden or (select public.queen16_is_admin()));
create policy queen16_prod_read on public.queen16_products      for select to anon, authenticated using (not hidden or (select public.queen16_is_admin()));
create policy queen16_set_read  on public.queen16_settings      for select to anon, authenticated using (true);

create policy queen16_cat_ins on public.queen16_categories for insert to authenticated with check ((select public.queen16_is_admin()));
create policy queen16_cat_upd on public.queen16_categories for update to authenticated using ((select public.queen16_is_admin())) with check ((select public.queen16_is_admin()));
create policy queen16_cat_del on public.queen16_categories for delete to authenticated using ((select public.queen16_is_admin()));
create policy queen16_sub_ins on public.queen16_subcategories for insert to authenticated with check ((select public.queen16_is_admin()));
create policy queen16_sub_upd on public.queen16_subcategories for update to authenticated using ((select public.queen16_is_admin())) with check ((select public.queen16_is_admin()));
create policy queen16_sub_del on public.queen16_subcategories for delete to authenticated using ((select public.queen16_is_admin()));
create policy queen16_prod_ins on public.queen16_products for insert to authenticated with check ((select public.queen16_is_admin()));
create policy queen16_prod_upd on public.queen16_products for update to authenticated using ((select public.queen16_is_admin())) with check ((select public.queen16_is_admin()));
create policy queen16_prod_del on public.queen16_products for delete to authenticated using ((select public.queen16_is_admin()));
create policy queen16_set_ins on public.queen16_settings for insert to authenticated with check ((select public.queen16_is_admin()));
create policy queen16_set_upd on public.queen16_settings for update to authenticated using ((select public.queen16_is_admin())) with check ((select public.queen16_is_admin()));
create policy queen16_order_read on public.queen16_orders for select to authenticated using ((select public.queen16_is_admin()));
create policy queen16_order_upd  on public.queen16_orders for update to authenticated using ((select public.queen16_is_admin())) with check ((select public.queen16_is_admin()));
create policy queen16_order_del  on public.queen16_orders for delete to authenticated using ((select public.queen16_is_admin()));

-- Customers never write tables directly. Checkout goes through these functions.
create schema if not exists queen16_private;
revoke all on schema queen16_private from public;
grant usage on schema queen16_private to anon, authenticated;
create or replace function queen16_private.place_order(p_items jsonb, p_name text, p_phone text, p_location text, p_notes text default '')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_lines jsonb := '[]'::jsonb; v_total bigint := 0; v_it jsonb; v_qty int; v_p record;
  v_id text; v_token uuid;
begin
  p_name := btrim(coalesce(p_name,'')); p_phone := btrim(coalesce(p_phone,'')); p_location := btrim(coalesce(p_location,''));
  p_notes := left(btrim(coalesce(p_notes,'')), 500);
  if length(p_name) not between 1 and 120 then raise exception 'Please enter your name.'; end if;
  if length(regexp_replace(p_phone,'\D','','g')) not between 9 and 15 or length(p_phone) > 30 then raise exception 'Please enter a valid phone number.'; end if;
  if length(p_location) not between 1 and 200 then raise exception 'Please enter a delivery location.'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 50 then raise exception 'Your bag is empty.'; end if;
  for v_it in select * from jsonb_array_elements(p_items) loop
    v_qty := coalesce((v_it->>'qty')::int, 0);
    if v_qty not between 1 and 50 then raise exception 'Invalid quantity.'; end if;
    select id, name, price, stock into v_p from public.queen16_products where id = v_it->>'id' and not hidden;
    if not found or v_p.price is null then raise exception 'A product in your bag is no longer available. Please refresh the page.'; end if;
    if v_p.stock is not null and v_p.stock < v_qty then raise exception '% is out of stock or has fewer pieces left.', v_p.name; end if;
    v_lines := v_lines || jsonb_build_object('id', v_p.id, 'name', v_p.name, 'qty', v_qty, 'price', v_p.price);
    v_total := v_total + v_p.price * v_qty;
  end loop;
  v_id := 'Q16-' || nextval('public.queen16_order_seq');
  insert into public.queen16_orders(id, customer_name, customer_phone, location, notes, items, total, status)
    values (v_id, p_name, p_phone, p_location, p_notes, v_lines, v_total, 'awaiting_payment')
    returning token into v_token;
  return jsonb_build_object('id', v_id, 'token', v_token, 'total', v_total, 'items', v_lines);
end $$;

create or replace function queen16_private.submit_txn(p_id text, p_token uuid, p_txn text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_o record;
begin
  p_txn := upper(btrim(coalesce(p_txn,'')));
  if p_txn !~ '^[A-Z0-9][A-Z0-9 .\-]{3,39}$' then raise exception 'Please enter the transaction ID from your Mobile Money SMS.'; end if;
  update public.queen16_orders set txn_id = p_txn, txn_submitted_at = now(), status = 'waiting_confirmation'
    where id = p_id and token = p_token and status in ('awaiting_payment','waiting_confirmation')
    returning id, total, items, txn_id, customer_name, customer_phone, location, notes into v_o;
  if not found then raise exception 'Order not found or already confirmed.'; end if;
  return to_jsonb(v_o);
end $$;


revoke all on function queen16_private.place_order(jsonb,text,text,text,text) from public;
revoke all on function queen16_private.submit_txn(text,uuid,text) from public;
grant execute on function queen16_private.place_order(jsonb,text,text,text,text) to anon, authenticated;
grant execute on function queen16_private.submit_txn(text,uuid,text) to anon, authenticated;

create or replace function public.queen16_place_order(p_items jsonb, p_name text, p_phone text, p_location text, p_notes text default '')
returns jsonb language sql security invoker set search_path = '' as $$
  select queen16_private.place_order(p_items, p_name, p_phone, p_location, p_notes)
$$;
create or replace function public.queen16_submit_txn(p_id text, p_token uuid, p_txn text)
returns jsonb language sql security invoker set search_path = '' as $$
  select queen16_private.submit_txn(p_id, p_token, p_txn)
$$;
revoke all on function public.queen16_place_order(jsonb,text,text,text,text) from public;
revoke all on function public.queen16_submit_txn(text,uuid,text) from public;
grant execute on function public.queen16_place_order(jsonb,text,text,text,text) to anon, authenticated;
grant execute on function public.queen16_submit_txn(text,uuid,text) to anon, authenticated;
create index if not exists queen16_subcategories_category_idx on public.queen16_subcategories(category);

-- keep updated_at fresh
create or replace function public.queen16_touch() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
create trigger queen16_products_touch before update on public.queen16_products for each row execute function public.queen16_touch();
create trigger queen16_settings_touch before update on public.queen16_settings for each row execute function public.queen16_touch();

-- Only the store admin account may exist: block any other sign-up.
create or replace function public.queen16_block_signups() returns trigger
language plpgsql set search_path = '' as $$
begin
  if lower(coalesce(new.email,'')) <> 'queen16beautyempire0@gmail.com' then
    raise exception 'Sign-ups are closed for this store.';
  end if;
  return new;
end $$;
revoke all on function public.queen16_block_signups() from public, anon, authenticated;
drop trigger if exists queen16_block_signups on auth.users;
create trigger queen16_block_signups before insert on auth.users for each row execute function public.queen16_block_signups();
