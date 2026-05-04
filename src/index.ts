// Load environment variables before importing the app (ensures resolvers/hooks can read them)
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

// IMPORTANT: Use `require` (not `import`) so dotenv runs first in compiled JS.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { app } = require('./app')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { logger } = require('./logger')

const port = app.get('port')
const host = app.get('host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${host}:${port}`)
})

