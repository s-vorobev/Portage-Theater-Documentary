INSERT INTO submission_files
  (submission_id, original_filename, generated_filename, dropbox_path, mime_type, file_size_bytes)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING file_id;