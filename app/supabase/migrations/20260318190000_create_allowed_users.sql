-- Allowed users whitelist
CREATE TABLE IF NOT EXISTS allowed_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE allowed_users ENABLE ROW LEVEL SECURITY;

-- Authenticated users can only read their own row
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own row' AND tablename = 'allowed_users'
  ) THEN
    CREATE POLICY "Users can read own row" ON allowed_users
      FOR SELECT
      TO authenticated
      USING (email = auth.jwt() ->> 'email');
  END IF;
END
$$;

-- Seed initial users
INSERT INTO allowed_users (email, name) VALUES
  ('john@beach-events.co.uk', 'John'),
  ('heather@beach-events.co.uk', 'Heather'),
  ('james@onefineplay.com', 'James')
ON CONFLICT (email) DO NOTHING;
