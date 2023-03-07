const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')

const checkToken = accessToken => {
  let isExpired = false

  if (accessToken) {
    const { exp: expireTime } = jwt.decode(accessToken)
    const currentTime = dayjs().unix() + 600

    isExpired = expireTime <= currentTime
  }

  return isExpired
}

const getDomain = () => {
  const env = process.env.ENVIRONMENT
  const envMapper = {
    local: '.brianmatthewsmith.test',
    development: '.development.brianmatthewsmith.com',
    staging: '.staging.brianmatthewsmith.com',
    production: '.brianmatthewsmith.com'
  }

  return envMapper[env] || '.ine.com'
}

const cookieOptions = {
  domain: getDomain(),
  // maxAge: 30 * 60 * 1000,
  httpOnly: false,
  secure: false,
  sameSite: 'Strict'
}

const setAccessToken = (accessToken, res) => {
  res.cookie('bms_access_token', accessToken, cookieOptions)
}

const clearTokens = res => {
  res.cookie('bms_access_token', '', { ...cookieOptions, maxAge: -1 })
}

const refreshToken = async (req, res) => {
  let request = {}
  const {
    cookies: { access_token: access, refresh_token: refresh }
  } = req

  if (access && access.length) {
    const isExpired = checkToken(access)

    if (isExpired) {
      // const { Bearer, Refresh } = await postRefreshToken({ access, refresh })
      // setAccessToken(Bearer, Refresh, res)
      // request = {
      //   ...req,
      //   headers: {
      //     ...req.headers,
      //     Authorization: `Bearer ${Bearer}`
      //   }
      // }
    } else {
      request = {
        ...req,
        headers: {
          ...req.headers,
          Authorization: `Bearer ${access}`
        }
      }
    }
  } else {
    request = {
      ...req
    }
  }

  return request
}

module.exports = {
  setAccessToken,
  clearTokens,
  refreshToken
}
