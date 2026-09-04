import { pool } from '../db/pool.js'
import { queries } from '../db/sql/loader.js'
import { mapContentRow } from '../mappers/contentMapper.js'

export async function getContent(slug) {
  const result = await pool.query(queries.selectContent, [slug])
  return mapContentRow(result.rows[0])
}

export async function updateContent(slug, body) {
  const result = await pool.query(queries.updateContent, [body, slug])
  return mapContentRow(result.rows[0])
}
