export class Content{
      constructor({
    content_id = null,
    slug,
    body,
    updated_at,
  }) {
    this.content_id = content_id
    this.slug = slug
    this.body = body
    this.updated_at = updated_at
  }
}