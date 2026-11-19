import * as mediaService from '../services/mediaService.js'

async function streamResponse(req, res, loadMedia) {
  const { size, contentType, range, body } = await loadMedia(req.headers.range)

  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Content-Type', contentType)

  if (range.type === 'none') {
    res.status(200)
    res.setHeader('Content-Length', size)
  } else if (range.type === 'unsatisfiable') {
    res.status(416)
    res.setHeader('Content-Range', `bytes */${size}`)
    res.end()
    return
  } else {
    res.status(206)
    res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${size}`)
    res.setHeader('Content-Length', range.end - range.start + 1)
  }

  body.on('error', (err) => {
    console.error('Error streaming media:', err)
    res.destroy()
  })

  body.pipe(res)
}

export async function getFootage(req, res) {
  await streamResponse(req, res, mediaService.streamFootage)
}

export async function getFootageMobile(req, res) {
  await streamResponse(req, res, mediaService.streamFootageMobile)
}
