-- ============================================================
-- GigShield Supabase Schema
-- Run this in your Supabase project's SQL Editor
-- ============================================================

-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  location text,
  password_hash text not null,
  created_at timestamptz default now()
);

-- Plans table
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  features jsonb not null default '[]'
);

-- Claims table
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  icon text,
  date text,
  status text default 'Pending',
  amount numeric,
  created_at timestamptz default now()
);

-- Earnings table
create table if not exists earnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text not null,
  amount numeric not null,
  date text,
  status text,
  icon text,
  created_at timestamptz default now()
);

-- Payouts table
create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text not null,
  amount numeric not null,
  date text,
  status text,
  icon text,
  created_at timestamptz default now()
);

-- Health stats table
create table if not exists health_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  heart_rate integer,
  steps integer,
  safety_score integer
);

-- Appointments table
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  date text,
  location text,
  icon text
);

-- Coverage table
create table if not exists coverage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  label text not null,
  value text not null
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Seed plans
insert into plans (name, price, features) values
(
  'Basic Gig',
  299,
  '["Accident cover up to ₹2L", "OPD cover ₹5,000/yr", "24/7 helpline", "App-based claims"]'
),
(
  'Pro Shield',
  599,
  '["Accident cover up to ₹5L", "OPD cover ₹15,000/yr", "Critical illness cover", "Income protection 3 months", "Priority claims"]'
),
(
  'Elite Guard',
  999,
  '["Accident cover up to ₹10L", "OPD cover ₹30,000/yr", "Critical illness + hospitalization", "Income protection 6 months", "Dedicated relationship manager", "Gym & wellness perks"]'
)
on conflict do nothing;

-- Seed demo user (password: password123)
-- bcrypt hash for "password123"
insert into users (id, name, email, phone, location, password_hash) values
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Rahul Sharma',
  'rahul@delivery.com',
  '+91 98765 43210',
  'Mumbai, Maharashtra',
  '$2a$10$eYMsKMWF4M2yGDtvddP3uuxfKAnKluFvPFCRWJqaik3t93wuGVyvO'
)
on conflict do nothing;

-- Seed claims for demo user
insert into claims (user_id, title, icon, date, status, amount) values
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bike Accident Claim', '🏍️', 'Mar 15, 2025', 'Approved', 15000),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Medical Expense', '🏥', 'Feb 28, 2025', 'Pending', 8500),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Phone Damage', '📱', 'Jan 10, 2025', 'Rejected', 3200)
on conflict do nothing;

-- Seed earnings for demo user
insert into earnings (user_id, type, amount, date, status, icon) values
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Delivery Bonus', 500, 'Today', 'Credited', '🚀'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Weekly Payout', 3200, 'Mar 18', 'Credited', '💰'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Referral Bonus', 250, 'Mar 15', 'Credited', '🎁'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Surge Earning', 800, 'Mar 12', 'Credited', '⚡')
on conflict do nothing;

-- Seed payouts for demo user
insert into payouts (user_id, type, amount, date, status, icon) values
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Weekly Payout', 3200, 'Mar 18, 2025', 'Completed', '💰'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Claim Reimbursement', 15000, 'Mar 15, 2025', 'Completed', '🏥'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bonus Payout', 750, 'Mar 10, 2025', 'Completed', '🎉')
on conflict do nothing;

-- Seed health stats for demo user
insert into health_stats (user_id, heart_rate, steps, safety_score) values
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 72, 8432, 85)
on conflict (user_id) do nothing;

-- Seed appointments for demo user
insert into appointments (user_id, title, date, location, icon) values
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Health Check-up', 'Mar 25, 2025 10:00 AM', 'City Clinic, Andheri', '🏥'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Dental Cleaning', 'Apr 2, 2025 2:30 PM', 'SmileCare Dental', '🦷')
on conflict do nothing;

-- Seed coverage for demo user
insert into coverage (user_id, label, value) values
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Accident Cover', '₹5,00,000'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Medical Cover', '₹1,00,000'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Income Protection', '3 months'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'OPD Cover', '₹15,000/yr')
on conflict do nothing;
