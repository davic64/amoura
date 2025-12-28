-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  partner_id UUID REFERENCES profiles(id),
  together_since TIMESTAMP WITH TIME ZONE,
  days_together INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_invite_code_idx ON profiles(invite_code);
CREATE INDEX IF NOT EXISTS profiles_partner_id_idx ON profiles(partner_id);

-- PARTNERS TABLE
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_1 UUID REFERENCES profiles(id) NOT NULL,
  user_id_2 UUID REFERENCES profiles(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'rejected', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2)
);

CREATE INDEX IF NOT EXISTS partners_users_idx ON partners(user_id_1, user_id_2);

-- MOODS TABLE
CREATE TABLE IF NOT EXISTS moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('Feliz', 'Cansado', 'Enojado', 'Enamorado', 'Triste', 'Emocionado')),
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS moods_user_id_idx ON moods(user_id);
CREATE INDEX IF NOT EXISTS moods_created_at_idx ON moods(created_at DESC);

-- EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_created_by_idx ON events(created_by);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(event_date);

-- PLANS TABLE
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  items JSONB DEFAULT '[]',
  color TEXT DEFAULT '#FF6B92',
  created_by UUID REFERENCES profiles(id) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS plans_created_by_idx ON plans(created_by);

-- MISS_YOU_LOGS TABLE
CREATE TABLE IF NOT EXISTS miss_you_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS miss_you_logs_sender_idx ON miss_you_logs(sender_id);
CREATE INDEX IF NOT EXISTS miss_you_logs_receiver_idx ON miss_you_logs(receiver_id);
CREATE INDEX IF NOT EXISTS miss_you_logs_created_at_idx ON miss_you_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE miss_you_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES PROFILES
-- ============================================

-- Users can view own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view linked partner
CREATE POLICY "Users can view linked partner" ON profiles
  FOR SELECT
  USING (
    auth.uid() = user_id OR 
    auth.uid() = partner_id OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() AND p.partner_id = profiles.partner_id
    )
  );

-- Users can insert own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES PARTNERS
-- ============================================

-- Users can view own partners
CREATE POLICY "Users can view own partners" ON partners
  FOR SELECT
  USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

-- Users can insert own partners
CREATE POLICY "Users can insert own partners" ON partners
  FOR INSERT
  WITH CHECK (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

-- ============================================
-- POLICIES MOODS
-- ============================================

-- Users can view partner moods
CREATE POLICY "Users can view partner moods" ON moods
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    user_id IN (SELECT partner_id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can insert own moods
CREATE POLICY "Users can insert own moods" ON moods
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- POLICIES EVENTS
-- ============================================

-- Users can view partner events
CREATE POLICY "Users can view partner events" ON events
  FOR SELECT
  USING (
    created_by = auth.uid() OR 
    created_by IN (SELECT partner_id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can insert own events
CREATE POLICY "Users can insert own events" ON events
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Only creator can update events
CREATE POLICY "Only creator can update events" ON events
  FOR UPDATE
  USING (created_by = auth.uid());

-- Only creator can delete events
CREATE POLICY "Only creator can delete events" ON events
  FOR DELETE
  USING (created_by = auth.uid());

-- ============================================
-- POLICIES PLANS
-- ============================================

-- Users can view partner plans
CREATE POLICY "Users can view partner plans" ON plans
  FOR SELECT
  USING (
    created_by = auth.uid() OR 
    created_by IN (SELECT partner_id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can insert own plans
CREATE POLICY "Users can insert own plans" ON plans
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Only creator can update plans
CREATE POLICY "Only creator can update plans" ON plans
  FOR UPDATE
  USING (created_by = auth.uid());

-- Only creator can delete plans
CREATE POLICY "Only creator can delete plans" ON plans
  FOR DELETE
  USING (created_by = auth.uid());

-- ============================================
-- POLICIES MISS_YOU_LOGS
-- ============================================

-- Users can view own miss you logs
CREATE POLICY "Users can view own miss you logs" ON miss_you_logs
  FOR SELECT
  USING (sender_id = auth.uid());

-- Users can insert own miss you logs
CREATE POLICY "Users can insert own miss you logs" ON miss_you_logs
  FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := 'AM-' || substr(chars, (random() * length(chars) + 1)::INT, 1) || '-' || substr(chars, (random() * length(chars) + 1)::INT, 1) || substr(chars, (random() * length(chars) + 1)::INT, 1) || substr(chars, (random() * length(chars) + 1)::INT, 1);
    
    SELECT EXISTS(SELECT 1 FROM profiles WHERE invite_code = code) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Link partners (atomic transaction)
CREATE OR REPLACE FUNCTION link_partners(user1_id UUID, user2_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET partner_id = user2_id WHERE user_id = user1_id;
  UPDATE profiles SET partner_id = user1_id WHERE user_id = user2_id;
  
  INSERT INTO partners (user_id_1, user_id_2, status) VALUES (user1_id, user2_id, 'accepted');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate days together automatically
CREATE OR REPLACE FUNCTION calculate_days_together()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.together_since IS NOT NULL THEN
    NEW.days_together := FLOOR(DATE_PART('day', NOW() - NEW.together_since));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update days together automatically
DROP TRIGGER IF EXISTS update_days_together ON profiles;
CREATE TRIGGER update_days_together
  BEFORE INSERT OR UPDATE OF together_since ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_days_together();

-- Create profile automatically on user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION generate_invite_code() AS invite_code,
    full_name = NEW.raw_user_meta_data->>'full_name';
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION generate_invite_code() AS invite_code,
    full_name = NEW.raw_user_meta_data->>'full_name';
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION generate_invite_code() AS invite_code,
    full_name = NEW.raw_user_meta_data->>'full_name';
