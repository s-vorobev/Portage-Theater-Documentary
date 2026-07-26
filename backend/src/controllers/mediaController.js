import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  endpoint: process.env.BUCKET_ENDPOINT,
  region: process.env.BUCKET_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_KEY,
  },
})

async function redirectToPresignedUrl(res, key) {
  try {
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
      }),
      { expiresIn: 3600 },
    )
    res.redirect(url)
  } catch (err) {
    console.error(`Bucket presign error for key "${key}":`, err)
    res.status(500).send('Could not load media')
  }
}

export const getFootage = (req, res) => {
  redirectToPresignedUrl(res, 'footage.mp4')
}

export const getFootageMobile = (req, res) => {
  redirectToPresignedUrl(res, 'footage_mobile.mov')
}
