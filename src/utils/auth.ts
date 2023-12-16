import { CookieOptions } from 'express'
import dayjs from 'dayjs'
import { sign } from 'jsonwebtoken'

const env = process.env.NODE_ENV ?? 'production'
const tokenSecret = process.env.ENV_TOKEN_SECRET ?? ''

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

export const signAccessToken = (userId: string) =>
  sign(
    {
      userId
    },
    tokenSecret,
    {
      expiresIn: 60 * 60 * 30
    }
  )

export const signRefreshToken = () => sign({}, tokenSecret, { expiresIn: '7d' })
