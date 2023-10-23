// Common
import fetch from 'node-fetch'
import { validationResult } from 'express-validator'

// Types
import { IRequest } from 'types'

const { ENV_RECAPTCHA_URL = '', ENV_RECAPTCHA_SECRET = '' } = process.env

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
