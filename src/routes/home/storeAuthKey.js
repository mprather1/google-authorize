import fs from 'fs'

const TOKEN_DIR = process.env.HOME || process.env.HOMEPATH || `${process.env.USERPROFILE}/.credentials/`
const TOKEN_PATH = `${TOKEN_DIR}/quickstart.json`

export default function (options) {
  return async function (req, res) {
    const { credentials } = options
    let auth = await credentials.auth()
    let oauth = auth.client.oauth
    console.log(req.body.token)
    oauth.getToken(req.body.token, (err, token) => {
      if (err) {
        console.log(err)
      }

      oauth.credentials = token
      storeToken(token)
      res.send('success')
    })
  }
}

function storeToken (token) {
  try {
    fs.mkdirSync(TOKEN_DIR)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }

  fs.writeFile(TOKEN_PATH, JSON.stringify(token))
  console.log(`Token stored at: ${TOKEN_PATH}`)
}
