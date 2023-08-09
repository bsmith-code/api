// Common
import nodemailer from 'nodemailer'
import { validationResult } from 'express-validator'
import fetch from 'node-fetch'

// Types
import { IRequest, IResponse, IPortfolioEmail } from 'types'

const {
  ENV_SMTP_USER = '',
  ENV_SMTP_PASS = '',
  ENV_SMTP_HOST = '',
  ENV_RECAPTCHA_URL = '',
  ENV_RECAPTCHA_SECRET = ''
} = process.env

const transporter = nodemailer.createTransport({
  port: 465,
  host: ENV_SMTP_HOST,
  auth: {
    user: ENV_SMTP_USER,
    pass: ENV_SMTP_PASS
  },
  secure: true
})

const verifyReCaptcha = async (token: string) => {
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

export const postEmail = async (
  req: IRequest<undefined, IPortfolioEmail>,
  res: IResponse<{ message: string }>
) => {
  try {
    const result = validationResult(req)

    if (!result.isEmpty()) {
      throw new Error('Invalid form data.')
    }

    const { firstName, lastName, email, subject, message, recaptcha } = req.body

    await verifyReCaptcha(recaptcha)

    const mailData = {
      from: `${firstName} ${lastName} <${email}>`,
      to: ENV_SMTP_USER,
      subject,
      text: message
    }

    const data = await transporter.sendMail(mailData)

    res.send(data)
  } catch (error) {
    const { message } = error as Error
    res.status(400).send({ message })
  }
}
