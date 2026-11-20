import * as contentService from '../services/contentService.js'

export async function getContent(req, res) {
  const content = await contentService.getContent(req.params.slug)
  res.json(content)
}

export async function updateContent(req, res) {
  await contentService.updateContent(req.params.slug, req.body?.body)
  res.status(204).end()
}
