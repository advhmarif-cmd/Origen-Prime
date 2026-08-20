-- Origen-Prime production-safety migration.
-- Apply with Supabase migrations before enabling live orders.

alter table public.products
  add column if not exists is_active boolean not null default true,
  add column if not exists discount_percentage numeric not null default 0,
  add column if not exists reviews jsonb not null default '[]'::jsonb,
  add column if not exists phone_number text,
  add column if not exists category text,
  add column if not exists logo_url text,
  add column if not exists navbar_badges jsonb not null default '[]'::jsonb,
  add column if not exists trust_badges jsonb not null default '[]'::jsonb,
  add column if not exists promo_tagline text,
  add column if not exists satisfaction_record text,
  add column if not exists satisfaction_subtext text,
  add column if not exists success_count_text text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.orders
  add column if not exists order_group_id uuid not null default gen_random_uuid(),
  add column if not exists customer_phone text,
  add column if not exists customer_address text,
  add column if not exists delivery_zone text,
  add column if not exists delivery_charge numeric not null default 0,
  add column if not exists product_title text,
  add column if not exists quantity integer not null default 1,
  add column if not exists total_amount numeric not null default 0;

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public read products" on public.products;
drop policy if exists "Public insert orders" on public.orders;
drop policy if exists products_public_read on public.products;
drop policy if exists orders_public_insert on public.orders;
drop policy if exists orders_public_read on public.orders;

create policy products_public_read
on public.products
for select
to anon, authenticated
using (is_active = true);

revoke insert, update, delete on table public.products from anon, authenticated;
revoke select, insert, update, delete on table public.orders from anon, authenticated;
grant select on table public.products to anon, authenticated;

drop function if exists public.create_order_server_authoritative(uuid, text, text, text, text, integer);
drop function if exists public.create_orders_from_cart(jsonb, text, text, text, text);

create or replace function public.create_orders_from_cart(
  p_items jsonb,
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_delivery_zone text
)
returns setof public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_product public.products%rowtype;
  v_product_id uuid;
  v_quantity integer;
  v_delivery numeric;
  v_unit_price numeric;
  v_total numeric;
  v_order_group_id uuid := gen_random_uuid();
  v_index integer := 0;
  v_order public.orders;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 20 then
    raise exception 'Cart is empty or too large';
  end if;

  if length(trim(coalesce(p_customer_name, ''))) < 2 then
    raise exception 'Customer name is required';
  end if;

  if length(regexp_replace(coalesce(p_customer_phone, ''), '\\s', '', 'g')) < 11 then
    raise exception 'Valid customer phone is required';
  end if;

  if length(trim(coalesce(p_customer_address, ''))) < 8 then
    raise exception 'Customer address is required';
  end if;

  if p_delivery_zone not in ('inside', 'outside') then
    raise exception 'Invalid delivery zone';
  end if;

  for v_item in select value from jsonb_array_elements(p_items) as items(value) loop
    begin
      v_product_id := (v_item->>'product_id')::uuid;
      v_quantity := (v_item->>'quantity')::integer;
    exception when others then
      raise exception 'Invalid cart item';
    end;

    if v_quantity is null or v_quantity < 1 or v_quantity > 20 then
      raise exception 'Invalid quantity';
    end if;

    select * into v_product
    from public.products
    where id = v_product_id
      and is_active = true
      and lower(coalesce(stock_status, '')) not in ('out of stock', 'sold out')
    for share;

    if not found then
      raise exception 'Product is not available';
    end if;

    v_unit_price := coalesce(v_product.sale_price, v_product.regular_price);
    if v_unit_price is null or v_unit_price < 0 then
      raise exception 'Product price is not configured';
    end if;

    v_delivery := case
      when v_index = 0 and p_delivery_zone = 'inside' then coalesce(v_product.delivery_charge_inside, 0)
      when v_index = 0 and p_delivery_zone = 'outside' then coalesce(v_product.delivery_charge_outside, 0)
      else 0
    end;
    v_total := (v_unit_price * v_quantity) + v_delivery;

    insert into public.orders (
      order_group_id,
      product_id,
      customer_name,
      phone,
      address,
      status,
      customer_phone,
      customer_address,
      delivery_zone,
      delivery_charge,
      product_title,
      quantity,
      total_amount
    ) values (
      v_order_group_id,
      v_product.id,
      trim(p_customer_name),
      regexp_replace(trim(p_customer_phone), '\\s', '', 'g'),
      trim(p_customer_address),
      'pending',
      regexp_replace(trim(p_customer_phone), '\\s', '', 'g'),
      trim(p_customer_address),
      p_delivery_zone,
      v_delivery,
      v_product.title,
      v_quantity,
      v_total
    ) returning * into v_order;

    v_index := v_index + 1;
    return next v_order;
  end loop;
end;
$$;

revoke all on function public.create_orders_from_cart(jsonb, text, text, text, text) from public;
grant execute on function public.create_orders_from_cart(jsonb, text, text, text, text) to service_role;
