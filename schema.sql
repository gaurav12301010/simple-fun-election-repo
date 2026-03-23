-- schema.sql
-- Run this in your Supabase SQL Editor to update your database.

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'review', 'verified', 'rejected')),
  admin_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1b. Add extra fields to users (run even if table exists)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS voter_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS height TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS eye_color TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS favorite_subject TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS trust_reason TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS child_income TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS partner_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS crush_count TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS mobile_usage TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS early_riser TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS signature_url TEXT;

-- 2. Update Candidates Table
-- Assuming it already exists with columns like name, short_form, party, agenda, logo_url
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS party_name TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS party_code TEXT;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Set any existing NULL statuses to 'approved'
UPDATE public.candidates SET status = 'approved' WHERE status IS NULL;

-- 3. Recreate Votes Table
DROP TABLE IF EXISTS public.votes;
CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id) -- One vote per user!
);

-- 4. Disable RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes DISABLE ROW LEVEL SECURITY;
