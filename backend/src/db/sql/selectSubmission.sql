SELECT first_name, last_name, email, phone, message, created_at
FROM submissions
WHERE submission_id = $1;
