export function mapContentRow(row) {
  if (!row) return null
  return {
    contentId: row.content_id,
    slug: row.slug,
    body: row.body,
    updatedAt: row.updated_at,
  }
}
