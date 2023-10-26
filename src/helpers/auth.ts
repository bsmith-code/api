import dayjs from 'dayjs'
import { CookieOptions } from 'express'
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
      id: userId
    },
    tokenSecret,
    {
      expiresIn: '1s'
    }
  )

export const signRefreshToken = (accessToken: string) =>
  sign({}, accessToken, { expiresIn: '7d' })
