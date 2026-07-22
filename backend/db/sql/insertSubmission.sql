INSERT INTO submissions (first_name, last_name, email, phone, message, ip_address)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING submission_id;