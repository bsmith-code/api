// Common
import { body } from 'express-validator'

// Constants
import {
  FORM_EMAIL,
  FORM_CAPTCHA,
  FORM_PASSWORD,
  FORM_LAST_NAME,
  FORM_FIRST_NAME
} from 'constants/forms'
import { IRequest } from 'types'
import { NextFunction, Response } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'

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

export const validateAndRefreshToken = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let token
  try {
    const {
      cookies: { accessToken }
    } = req

    if (!accessToken) {
      throw new Error('User not authenticated.')
    }

    token = verify(accessToken, tokenSecret) as JwtPayload & {
      id: string
    }

    next()
  } catch (error) {
    const { message } = error as Error
    if (message === 'jwt expired') {
      console.log(token)
    }
    return res.status(401).send({ message })
  }
}
