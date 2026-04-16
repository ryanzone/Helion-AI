-- Helion Backend Schema for Supabase Postgres
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS if needed
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Test data
INSERT INTO users (name, email, phone, city) VALUES ('Test User', 'test@example.com', '1234567890', 'NYC') ON CONFLICT (email) DO NOTHING;

