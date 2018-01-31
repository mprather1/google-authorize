import configApp from './app'
import configServer from './server'
import configRouter from './router'
import authorizer from './auth'

export async function start (options, callback) {
  const app = configApp(options)
  const server = configServer(app, options)
  const router = configRouter(options)

  app.use('/api', router)

  app.get('/', async (req, res, next) => {
    let heading, title, message
    let credentials = authorizer(options)
    let auth = await credentials.auth()

    options.credentials = credentials

    if (auth.authorized !== true) {
      title = 'Unauthorized'
      heading = 'Unauthorized'
      message = auth.token
    } else if (auth.authorized === true) {
      message = `Application is authorized...`
      title = 'Authorized'
      heading = 'Authorized'
    }

    res.render('index', {
      title: title,
      heading: heading,
      url: req.url,
      status: res.statusCode,
      message: message,
      authorized: auth.authorized
    })
  })

  app.use(function (req, res) {
    res.status(400)
    .format({
      json: () => {
        res.send({
          url: req.url,
          status: res.statusCode,
          message: `${res.statusCode}: Not found...`
        })
      },
      html: () => {
        res.render('error', {
          title: 'Error',
          heading: 'Error',
          url: req.url,
          status: res.statusCode,
          message: `${res.statusCode}: Not found...`
        })
      }
    })
  })

  return Promise.resolve(server)
}
