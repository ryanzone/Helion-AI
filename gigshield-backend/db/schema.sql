CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- PLANS (from pricing UI)
-- =========================
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    billing_cycle TEXT DEFAULT 'monthly',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- SUBSCRIPTIONS
-- =========================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id),
    status TEXT DEFAULT 'active',
    start_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- CLAIMS (from claims UI)
-- =========================
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    amount NUMERIC,
    status TEXT CHECK (status IN ('approved','pending','review')),
    is_auto BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- EARNINGS (for charts)
-- =========================
CREATE TABLE earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    platform TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- HEALTH / WELLNESS (dashboard cards)
-- =========================
CREATE TABLE health_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    safety_score INTEGER DEFAULT 0,
    heart_rate INTEGER DEFAULT 0,
    steps INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- APPOINTMENTS (wellness section)
-- =========================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    date TEXT,
    location TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- COVERAGE (policy UI cards)
-- =========================
CREATE TABLE coverage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label TEXT,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- DOCUMENTS (profile uploads)
-- =========================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    status TEXT DEFAULT 'uploaded',
    created_at TIMESTAMPTZ DEFAULT NOW()
);