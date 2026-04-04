-- ============================================================
-- Helion FULL DYNAMIC SYSTEM (FINAL - CLEAN SCHEMA)

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. USERS (AUTH READY)
-- ============================================================
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  city text,

  password_hash text not null,

  created_at timestamptz default now()
);

-- ============================================================
-- 2. PLANS
-- ============================================================
create table plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  weekly_price numeric not null,
  payout_amount numeric not null,
  peril_type text check (peril_type in ('rain','aqi','flood')),
  city_pool text,
  created_at timestamptz default now()
);

-- ============================================================
-- 3. SUBSCRIPTIONS
-- ============================================================
create table subscriptions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references users(id) on delete cascade,
  plan_id uuid references plans(id),

  status text default 'active'
    check (status in ('active','paused','expired')),

  start_date date default current_date,
  end_date date,

  city_pool text not null,
  underwriting_passed boolean default false,

  created_at timestamptz default now()
);

-- ============================================================
-- 4. WORKER ACTIVITY (UNDERWRITING)
-- ============================================================
create table worker_activity (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references users(id) on delete cascade,
  activity_date date not null,

  hours_active numeric,
  deliveries_count integer,

  city text,
  platform text,

  created_at timestamptz default now(),

  unique(user_id, activity_date)
);

-- ============================================================
-- 5. UNDERWRITING VIEW
-- ============================================================
create view worker_active_days_30 as
select
  user_id,
  count(*) as active_days,
  case when count(*) >= 7 then true else false end as eligible
from worker_activity
where activity_date >= current_date - interval '30 days'
group by user_id;

-- ============================================================
-- 6. TRIGGERS (PARAMETRIC ENGINE)
-- ============================================================
create table triggers (
  id uuid primary key default gen_random_uuid(),

  city_pool text not null,
  peril_type text not null,

  metric_value numeric not null,
  threshold_value numeric not null,

  triggered_at timestamptz default now(),
  affected_date date default current_date,

  data_source text,

  status text default 'fired'
    check (status in ('fired','processed','failed'))
);

-- ============================================================
-- 7. CLAIMS
-- ============================================================
create table claims (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references users(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete cascade,
  trigger_id uuid references triggers(id) on delete cascade,

  amount numeric not null,

  status text default 'pending'
    check (status in ('pending','approved','rejected','paid')),

  is_auto boolean default true,

  created_at timestamptz default now()
);

-- ============================================================
-- 8. PAYMENTS
-- ============================================================
create table payments (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references users(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete cascade,

  amount numeric not null,

  status text default 'success'
    check (status in ('pending','success','failed')),

  payment_method text,

  created_at timestamptz default now()
);

-- ============================================================
-- 9. PAYOUTS
-- ============================================================
create table payouts (
  id uuid primary key default gen_random_uuid(),

  claim_id uuid references claims(id) on delete cascade,

  amount numeric not null,

  status text default 'processing'
    check (status in ('processing','paid','failed')),

  paid_at timestamptz
);

-- ============================================================
-- 10. PREMIUM CALCULATION LOG
-- ============================================================
create table premium_calculation_log (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references users(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete cascade,

  base_premium numeric not null,
  activity_adjustment numeric default 0,

  final_premium numeric not null,

  calculated_at timestamptz default now()
);

-- ============================================================
-- 11. DOCUMENTS
-- ============================================================
create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  status text default 'Uploaded',
  created_at timestamptz default now()
);

-- ============================================================
-- 🔥 FUNCTION: AUTO CLAIM CREATION
-- ============================================================
create function create_claims_for_trigger()
returns trigger as $$
begin
  insert into claims (user_id, subscription_id, trigger_id, amount, is_auto)
  select
    s.user_id,
    s.id,
    new.id,
    p.payout_amount,
    true
  from subscriptions s
  join plans p on s.plan_id = p.id
  where
    s.status = 'active'
    and s.city_pool = new.city_pool
    and p.peril_type = new.peril_type;

  return new;
end;
$$ language plpgsql;

create trigger trigger_auto_claims
after insert on triggers
for each row
when (new.metric_value >= new.threshold_value)
execute function create_claims_for_trigger();

-- ============================================================
-- 🔥 FUNCTION: UNDERWRITING AUTO UPDATE
-- ============================================================
create function update_underwriting_status()
returns trigger as $$
begin
  update subscriptions
  set underwriting_passed = (
    select eligible
    from worker_active_days_30
    where user_id = new.user_id
  )
  where user_id = new.user_id;

  return new;
end;
$$ language plpgsql;

create trigger trigger_underwriting
after insert on worker_activity
for each row
execute function update_underwriting_status();

-- ============================================================
-- 🔥 FUNCTION: PREMIUM CALCULATION
-- ============================================================
create function calculate_premium()
returns trigger as $$
declare
  base numeric := 40;
  discount numeric := 0;
begin
  if new.underwriting_passed then
    discount := -5;
  end if;

  insert into premium_calculation_log (
    user_id,
    subscription_id,
    base_premium,
    activity_adjustment,
    final_premium
  )
  values (
    new.user_id,
    new.id,
    base,
    discount,
    base + discount
  );

  return new;
end;
$$ language plpgsql;

create trigger trigger_premium
after insert on subscriptions
for each row
execute function calculate_premium();

-- ============================================================
-- END
-- ============================================================

