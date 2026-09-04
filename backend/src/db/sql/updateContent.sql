UPDATE content
SET body = $1, updated_at = now()
WHERE slug = $2
RETURNING content_id;
