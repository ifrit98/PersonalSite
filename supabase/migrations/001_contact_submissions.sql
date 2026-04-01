CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  organization text,
  inquiry_type text NOT NULL,
  problem text NOT NULL,
  constraints text,
  desired_outcome text,
  timeline text,
  budget_range text,
  message text,
  status text DEFAULT 'new'
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert contact submissions"
  ON contact_submissions FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read contact submissions"
  ON contact_submissions FOR SELECT
  TO service_role
  USING (true);
