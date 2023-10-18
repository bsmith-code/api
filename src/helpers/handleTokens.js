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
  const env = process.env.NODE_ENV
  const envMapper = {
    local: '.brianmatthewsmith.local',
    production: '.brianmatthewsmith.com'
  }

  return envMapper[env]
}

const cookieOptions = {
  domain: getDomain(),
  httpOnly: true,
  secure: true,
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
