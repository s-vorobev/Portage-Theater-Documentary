SELECT submission_id
FROM submissions
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;
