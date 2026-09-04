SELECT content_id, slug, body, updated_at
FROM content
WHERE slug = $1;
