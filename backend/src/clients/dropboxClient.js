import { Dropbox } from 'dropbox'
import { env } from '../config/env.js'

const dbx = new Dropbox({
  refreshToken: env.DROPBOX_REFRESH_TOKEN,
  clientId: env.DROPBOX_APP_KEY,
  clientSecret: env.DROPBOX_APP_SECRET,
})

export async function uploadFile(fileBuffer, generatedFilename) {
  const path = `${env.DROPBOX_UPLOAD_FOLDER}/${generatedFilename}`

  const response = await dbx.filesUpload({
    path,
    contents: fileBuffer,
    mode: { '.tag': 'add' },
    autorename: false,
  })

  return response.result.path_display
}

export async function deleteFile(dropboxPath) {
  await dbx.filesDeleteV2({ path: dropboxPath })
}
