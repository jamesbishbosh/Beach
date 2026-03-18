CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  project_type text,
  budget text,
  message text,
  source text DEFAULT 'holding-page'
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Insert-only policy for anon role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous inserts' AND tablename = 'contacts'
  ) THEN
    CREATE POLICY "Allow anonymous inserts" ON contacts
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END
$$;
