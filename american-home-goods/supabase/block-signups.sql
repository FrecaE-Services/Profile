-- ONLY for a Supabase project used by American Home Goods alone.
-- Do NOT run this in a shared project: it blocks every other account from being created.
create or replace function public.ahg_block_signups() returns trigger
language plpgsql set search_path = '' as $$
begin
  if lower(coalesce(new.email,'')) <> 'admin@americanhomegoods.com' then
    raise exception 'Sign-ups are closed for this store.';
  end if;
  return new;
end $$;
revoke all on function public.ahg_block_signups() from public, anon, authenticated;
drop trigger if exists ahg_block_signups on auth.users;
create trigger ahg_block_signups before insert on auth.users for each row execute function public.ahg_block_signups();
