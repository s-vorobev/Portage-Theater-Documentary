CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS submissions (
  submission_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  message         TEXT NOT NULL,
  ip_address      INET NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submission_files (
  file_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id       UUID NOT NULL REFERENCES submissions(submission_id) ON DELETE CASCADE,
  original_filename   TEXT NOT NULL,
  generated_filename  TEXT NOT NULL UNIQUE,
  dropbox_path        TEXT NOT NULL,
  mime_type           TEXT NOT NULL,
  file_size_bytes     BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submission_files_submission_id
  ON submission_files(submission_id);

CREATE INDEX IF NOT EXISTS idx_submissions_ip_created
  ON submissions (ip_address, created_at);
