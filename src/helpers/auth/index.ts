import { CookieOptions, Response } from 'express'

const getDomain = () => {
  const env = process.env.NODE_ENV ?? 'production'
  const envMapper: Record<string, string> = {
    local: '.brianmatthewsmith.local',
    production: '.brianmatthewsmith.com'
  }

  return envMapper[env]
}

const cookieOptions: CookieOptions = {
  domain: getDomain(),
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
}

export const setAccessToken = (accessToken: string) => (res: Response) => {
  res.cookie('bms_access_token', accessToken, cookieOptions)
}
