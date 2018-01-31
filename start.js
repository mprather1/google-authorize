const path = require('path')
const logger = require('winston')
require('babel-polyfill')

const options = {
  basedir: __dirname,
  pkg: require(path.join(__dirname, 'package.json')),
  logger: logger,
  port: process.env['PORT'] || 8000,
  environment: process.env['NODE_ENV'] || 'development'
}

const application = require(path.join(__dirname, 'build'))

application.start(options)
.then(server => {
  server.listen(options.port)
})
.catch(err => {
  logger.error(err)
})
