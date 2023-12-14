import { validationResult } from 'express-validator'
import fetch from 'node-fetch'
import nodemailer from 'nodemailer'

import { IRequest } from 'types'

const {
  ENV_SMTP_HOST = '',
  ENV_SMTP_USER = '',
  ENV_SMTP_PASS = '',
  ENV_RECAPTCHA_URL = '',
  ENV_RECAPTCHA_SECRET = ''
} = process.env

export const transporter = nodemailer.createTransport({
  port: 465,
  host: ENV_SMTP_HOST,
  auth: {
    user: ENV_SMTP_USER,
    pass: ENV_SMTP_PASS
  },
  secure: true
})

export const verifyReCaptcha = async (token: string) => {
  const response = await fetch(
    `${ENV_RECAPTCHA_URL}?secret=${ENV_RECAPTCHA_SECRET}&response=${token}`,
    { method: 'POST' }
  )
  const data = (await response.json()) as {
    success: boolean
    challenge_ts: string
    hostname: string
  }

  return data
}

export const validateForm = <T>(req: IRequest<T>) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    throw new Error('Invalid form data.')
  }
}
