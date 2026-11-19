import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { env } from '../config/env.js'

const s3 = new S3Client({
  endpoint: env.BUCKET_ENDPOINT,
  region: env.BUCKET_REGION,
  credentials: {
    accessKeyId: env.BUCKET_ACCESS_KEY,
    secretAccessKey: env.BUCKET_SECRET_KEY,
  },
})

export async function getObjectHead(key) {
  return s3.send(new HeadObjectCommand({ Bucket: env.BUCKET_NAME, Key: key }))
}

export async function getObjectBody(key, range) {
  const command = new GetObjectCommand({
    Bucket: env.BUCKET_NAME,
    Key: key,
    ...(range ? { Range: range } : {}),
  })
  return s3.send(command)
}
