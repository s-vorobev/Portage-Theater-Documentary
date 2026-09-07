import {
  getContent as fetchContent,
  updateContent as saveContent,
} from '../services/contentService.js'

export async function getContent(req, res) {
  const content = await fetchContent(req.params.slug)
  res.json(content)
}

export async function putContent(req, res) {
  const content = await saveContent(req.params.slug, req.body?.body)
  res.json(content)
}
