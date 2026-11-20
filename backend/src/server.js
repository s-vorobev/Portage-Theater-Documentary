import { env } from './config/env.js'
import { app } from './app.js'

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT} (${env.NODE_ENV})`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${env.PORT} is already in use — another instance of this server ` +
        '(or another app) is already running.\n' +
        'Kill it (e.g. `lsof -ti tcp:<port> | xargs kill`), or set a different ' +
        'PORT in backend/.env.\n',
    )
  } else {
    console.error(err)
  }
  process.exit(1)
})
