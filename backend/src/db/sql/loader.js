import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function load(filename) {
  return readFileSync(join(__dirname, filename), 'utf8')
}

export const queries = {
  insertSubmission: load('insertSubmission.sql'),
  insertSubmissionFile: load('insertSubmissionFile.sql'),
  countRecentSubmissionsByIp: load('countRecentSubmissionsByIp.sql'),
  selectSubmissionIds: load('selectSubmissionIds.sql'),
  selectSubmission: load('selectSubmission.sql'),
  selectSubmissionFiles: load('selectSubmissionFiles.sql'),
  selectContent: load('selectContent.sql'),
  updateContent: load('updateContent.sql'),
}
