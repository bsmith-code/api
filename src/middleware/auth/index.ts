// Common
import { body } from 'express-validator'
import { NextFunction, Response } from 'express'
import { JwtPayload, decode, verify } from 'jsonwebtoken'
import dayjs from 'dayjs'

// Models
import { Token } from 'models/auth'

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

  const { id, exp } = decode(accessToken) as JwtPayload & {
    id: string
  }

  if (dayjs().isAfter(exp)) {
    try {
      const token = await Token.findOne({ where: { user: id } })
      verify(token?.refreshToken ?? '', accessToken)
    } catch (error) {
      const { message } = error as Error
      return res.status(401).send({ message })
    }
  }

  try {
    if (!accessToken) {
      throw new Error('User not authenticated.')
    }

    verify(accessToken, tokenSecret)

    next()
  } catch (error) {
    const { message } = error as Error
    if (message === 'jwt expired') {
      //
    }
    return res.status(401).send({ message })
  }
}
