-- American Home Goods online shop: database setup (Supabase / Postgres).
-- Tables are prefixed ahg_ so this also works inside a shared Supabase project.
-- Change the admin email in ahg_is_admin() if the admin login email changes
-- (it must match ADMIN_EMAIL in assets/config.js).

create or replace function public.ahg_is_admin() returns boolean
language sql stable set search_path = '' as $$
  select coalesce(lower(auth.jwt()->>'email'),'') = 'admin@americanhomegoods.com'
$$;

create table if not exists public.ahg_categories(
  slug text primary key,
  name text not null,
  blurb text not null default '',
  sort int not null default 0,
  hidden boolean not null default false);

create table if not exists public.ahg_products(
  id text primary key,
  name text not null,
  category text references public.ahg_categories(slug) on update cascade on delete set null,
  price bigint check (price is null or price >= 0),
  condition text not null default '',
  description text not null default '',
  specs jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  in_stock boolean not null default true,
  hidden boolean not null default false,
  featured boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now());
create index if not exists ahg_products_category_idx on public.ahg_products(category);

create table if not exists public.ahg_settings(
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now());

alter table public.ahg_categories enable row level security;
alter table public.ahg_products   enable row level security;
alter table public.ahg_settings   enable row level security;

-- Anyone can read what is not hidden. Only the admin sees hidden rows and can write.
create policy ahg_cat_read  on public.ahg_categories for select to anon, authenticated using (not hidden or (select public.ahg_is_admin()));
create policy ahg_prod_read on public.ahg_products   for select to anon, authenticated using (not hidden or (select public.ahg_is_admin()));
create policy ahg_set_read  on public.ahg_settings   for select to anon, authenticated using (true);

create policy ahg_cat_ins on public.ahg_categories for insert to authenticated with check ((select public.ahg_is_admin()));
create policy ahg_cat_upd on public.ahg_categories for update to authenticated using ((select public.ahg_is_admin())) with check ((select public.ahg_is_admin()));
create policy ahg_cat_del on public.ahg_categories for delete to authenticated using ((select public.ahg_is_admin()));
create policy ahg_prod_ins on public.ahg_products for insert to authenticated with check ((select public.ahg_is_admin()));
create policy ahg_prod_upd on public.ahg_products for update to authenticated using ((select public.ahg_is_admin())) with check ((select public.ahg_is_admin()));
create policy ahg_prod_del on public.ahg_products for delete to authenticated using ((select public.ahg_is_admin()));
create policy ahg_set_ins on public.ahg_settings for insert to authenticated with check ((select public.ahg_is_admin()));
create policy ahg_set_upd on public.ahg_settings for update to authenticated using ((select public.ahg_is_admin())) with check ((select public.ahg_is_admin()));

revoke all on public.ahg_categories, public.ahg_products, public.ahg_settings from anon;
grant select on public.ahg_categories, public.ahg_products, public.ahg_settings to anon;
grant select, insert, update, delete on public.ahg_categories, public.ahg_products, public.ahg_settings to authenticated;

create or replace function public.ahg_touch() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists ahg_products_touch on public.ahg_products;
create trigger ahg_products_touch before update on public.ahg_products for each row execute function public.ahg_touch();
drop trigger if exists ahg_settings_touch on public.ahg_settings;
create trigger ahg_settings_touch before update on public.ahg_settings for each row execute function public.ahg_touch();
