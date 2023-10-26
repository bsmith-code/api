// Common
import { body } from 'express-validator'
import { NextFunction, Response } from 'express'
import { JwtPayload, decode, verify } from 'jsonwebtoken'
import dayjs from 'dayjs'

// Models
import { Token } from 'models/auth'

// Utils
import { cookieOptions, signAccessToken } from 'helpers/auth'

// Constants
import {
  FORM_EMAIL,
  FORM_CAPTCHA,
  FORM_PASSWORD,
  FORM_LAST_NAME,
  FORM_FIRST_NAME
} from 'constants/forms'

// Types
import { IRequest } from 'types'

const tokenSecret = process.env.ENV_TOKEN_SECRET ?? ''

export const validateRegisterUser = () => {
  const requiredFields = body([
    FORM_EMAIL,
    FORM_CAPTCHA,
    FORM_PASSWORD,
    FORM_LAST_NAME,
    FORM_FIRST_NAME
  ])
    .trim()
    .notEmpty()
    .withMessage((_, { path }) => `${path} is required.`)

  const emailFields = body([FORM_EMAIL])
    .trim()
    .isEmail()
    .withMessage('Invalid email.')

  return [requiredFields, emailFields]
}

export const validateLoginUser = () => {
  const requiredFields = body([FORM_EMAIL, FORM_PASSWORD])
    .trim()
    .notEmpty()
    .withMessage((_, { path }) => `${path} is required.`)

  const emailFields = body([FORM_EMAIL])
    .trim()
    .isEmail()
    .withMessage('Invalid email.')

  return [requiredFields, emailFields]
}

export const validateAndRefreshToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const {
    cookies: { accessToken }
  } = req

  if (!accessToken) {
    return res.status(401).send({ message: 'User not authenticated.' })
  }

  const { id, userId, exp } = decode(accessToken) as JwtPayload & {
    id: string
    userId: string
  }

  res.locals.userId = userId

  try {
    if (dayjs().isAfter(exp)) {
      const token = await Token.findOne({ where: { userId } })
      console.log(token?.refreshToken ?? '', `${tokenSecret}${id}`)
      verify(token?.refreshToken ?? '', `${tokenSecret}${id}`)

      const newAccessToken = signAccessToken(userId)
      res.cookie('accessToken', newAccessToken, cookieOptions)
    } else {
      verify(accessToken, tokenSecret)
    }
  } catch (error) {
    const { message } = error as Error
    return res.status(401).send({ message })
  }

  next()
}
