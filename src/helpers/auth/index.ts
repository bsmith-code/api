import dayjs from 'dayjs'
import { CookieOptions } from 'express'

const env = process.env.NODE_ENV ?? 'production'

const getDomain = () => {
  const envMapper: Record<string, string> = {
    local: '.brianmatthewsmith.local',
    production: '.brianmatthewsmith.com'
  }

  return envMapper[env]
}

export const cookieOptions: CookieOptions = {
  path: '/',
  secure: env === 'production',
  httpOnly: true,
  sameSite: 'strict',
  domain: getDomain(),
  expires: dayjs().add(30, 'days').toDate()
}
