import dayjs from 'dayjs'
import { CookieOptions } from 'express'
import { JwtPayload, decode, sign } from 'jsonwebtoken'
import uniqid from 'uniqid'

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
      id: uniqid(),
      userId
    },
    tokenSecret,
    {
      expiresIn: '10s'
    }
  )

export const signRefreshToken = (accessToken: string) => {
  const { id } = decode(accessToken) as JwtPayload & { id: string }

  return sign({}, `${tokenSecret}${id}`, { expiresIn: '7d' })
}
