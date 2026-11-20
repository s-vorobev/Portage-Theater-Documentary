SELECT original_filename, generated_filename
FROM submission_files
WHERE submission_id = $1;
