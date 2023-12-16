import { NextFunction, Response } from 'express'
import { body } from 'express-validator'
import dayjs from 'dayjs'
import { decode, JwtPayload, verify } from 'jsonwebtoken'

import { Token } from 'models/token'

import { cookieOptions, signAccessToken } from 'utils/auth'

import {
  FORM_CAPTCHA,
  FORM_EMAIL,
  FORM_FIRST_NAME,
  FORM_LAST_NAME,
  FORM_PASSWORD
} from 'constants/forms'

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

  const { userId, exp } = decode(accessToken) as JwtPayload

  if (!exp || Number.isNaN(exp)) {
    return res.status(401).send({ message: 'Invalid exp.' })
  }

  res.locals.userId = userId

  try {
    if (dayjs().isAfter(dayjs.unix(exp))) {
      const token = await Token.findOne({ where: { userId } })
      verify(token?.refreshToken ?? '', tokenSecret)

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
