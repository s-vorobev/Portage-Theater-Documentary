import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '../config/env.js'

const PRESIGN_EXPIRES_IN_SECONDS = 3600

const s3 = new S3Client({
  endpoint: env.BUCKET_ENDPOINT,
  region: env.BUCKET_REGION,
  credentials: {
    accessKeyId: env.BUCKET_ACCESS_KEY,
    secretAccessKey: env.BUCKET_SECRET_KEY,
  },
})

export async function getPresignedUrl(key) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: env.BUCKET_NAME, Key: key }),
    { expiresIn: PRESIGN_EXPIRES_IN_SECONDS },
  )
}
