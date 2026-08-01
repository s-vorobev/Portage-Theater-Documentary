SELECT COUNT(*) AS submission_count
FROM submissions
WHERE ip_address = $1
  AND created_at > $2;