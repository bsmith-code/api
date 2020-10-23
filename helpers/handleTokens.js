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
  maxAge: 365 * 24 * 60 * 60 * 1000,
  httpOnly: false,
  secure: true,
  sameSite: 'Strict'
}

const setTokens = (accessToken, refreshToken, res) => {
  res.cookie('access_token', accessToken, cookieOptions)
  res.cookie('refresh_token', refreshToken, cookieOptions)
}

const clearTokens = res => {
  res.cookie('access_token', '', { ...cookieOptions, maxAge: -1 })
  res.cookie('refresh_token', '', { ...cookieOptions, maxAge: -1 })
}

module.exports = {
  setTokens,
  clearTokens
}
