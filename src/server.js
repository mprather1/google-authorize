import http from 'http'
import logger from 'winston'
import chalk from 'chalk'

export default function (app, options) {
  const { pkg, port } = options

  const server = http.Server(app)

  server.on('request', (req, res) => {
    logger.info(`${res.statusCode} - ${req.method} => ${req.url}`)
  })

  server.on('listening', () => {
    logger.info(`${chalk.bgBlack.cyan(pkg.name)} version ${chalk.bgBlack.yellow(pkg.version)} is listening on port ${chalk.bgBlack.green(port)}...`)
  })

  server.on('error', err => {
    logger.error(err)
  })

  return server
}
