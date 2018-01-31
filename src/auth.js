import fs from 'fs'
import path from 'path'
import GoogleAuth from 'google-auth-library'
import {promisify} from 'util'

const SCOPES = [
  'https://www.googleapis.com/auth/drive'
]

const TOKEN_DIR = process.env.HOME || process.env.HOMEPATH || `${process.env.USERPROFILE}/.credentials/`
const TOKEN_PATH = `${TOKEN_DIR}/quickstart.json`

const readFile = promisify(fs.readFile)

export default function auth (options) {
  const { basedir } = options
  let credentials, authorization

  return {
    auth: async function () {
      try {
        credentials = await readFile(path.join(basedir, 'client-secret.json'), 'utf8')
        authorization = await authorize(JSON.parse(credentials))
      } catch (err) {
        return err
      }

      return authorization
    },
    store: async function () {
      console.log(credentials)
    }
  }
}

async function authorize (credentials) {
  let clientSecret = credentials.installed.client_secret
  let clientId = credentials.installed.client_id
  let redirectUrl = credentials.installed.redirect_uris[0]
  let auth = new GoogleAuth()
  let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)
  let token, authorized

  try {
    authorized = true
    token = await readFile(TOKEN_PATH, 'utf8')
  } catch (err) {
    authorized = false
    token = await getNewToken(oauth2Client)
  }

  return Promise.resolve({
    token: token,
    authorized: authorized,
    client: {
      oauth: oauth2Client,
      secret: clientSecret,
      id: clientId
    }
  })
}

function getNewToken (oauth2Client) {
  return new Promise(function (resolve, reject) {
    let authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })

    resolve(`${authUrl}`)
  })
}
