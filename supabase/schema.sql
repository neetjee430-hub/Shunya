-- See SECTION 5 for the complete schema as requested.
-- Paste this into Supabase SQL Editor.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Types
CREATE TYPE grade_type AS ENUM ('BEST', 'GOOD', 'AVERAGE', 'REJECT');
CREATE TYPE subscription_tier AS ENUM ('STARTER', 'STANDARD', 'PREMIUM', 'ENTERPRISE');
CREATE TYPE batch_status AS ENUM ('FERMENTING', 'MATURING', 'READY', 'BOTTLED');
CREATE TYPE user_role AS ENUM ('HOUSEHOLD', 'DRIVER', 'ADMIN');

-- Tables
CREATE TABLE societies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  subscription_tier subscription_tier DEFAULT 'STARTER',
  monthly_fee INTEGER DEFAULT 0,
  total_flats INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flat_number TEXT NOT NULL,
  resident_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  static_qr_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  auth_user_id UUID UNIQUE,
  push_subscription JSONB,
  onboarded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  auth_user_id UUID UNIQUE,
  vehicle_id TEXT,
  assigned_society_ids UUID[] DEFAULT '{}',
  push_subscription JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) NOT NULL,
  driver_id UUID REFERENCES drivers(id),
  society_id UUID REFERENCES societies(id),
  collected_at TIMESTAMPTZ DEFAULT now(),
  weight_kg DECIMAL(5,2) NOT NULL CHECK (weight_kg > 0),
  grade grade_type NOT NULL,
  quality_multiplier DECIMAL(3,1) NOT NULL DEFAULT 0,
  credits_earned INTEGER NOT NULL DEFAULT 0,
  rejection_reason TEXT
);

CREATE TABLE credit_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) UNIQUE NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_redeemed INTEGER NOT NULL DEFAULT 0,
  current_streak_weeks INTEGER NOT NULL DEFAULT 0,
  last_collection_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Basic)
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Seed Data
INSERT INTO societies (name, city, subscription_tier, monthly_fee, total_flats)
VALUES ('Vasant Vihar', 'Lucknow', 'STANDARD', 10000, 100);

-- Note: In a real app, users would be created via Auth.
