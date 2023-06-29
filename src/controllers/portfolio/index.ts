// Common
import nodemailer from 'nodemailer'
import { validationResult } from 'express-validator'

// Types
import { IRequest, IResponse, IPortfolioEmail } from 'types'

const {
  ENV_SMTP_USER = '',
  ENV_SMTP_PASS = '',
  ENV_SMTP_HOST = ''
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

export const postEmail = async (
  req: IRequest<undefined, IPortfolioEmail>,
  res: IResponse<{ message: string }>
) => {
  try {
    const result = validationResult(req)

    if (!result.isEmpty()) {
      throw result.array()
    }

    const { firstName, lastName, email, subject, message } = req.body

    const mailData = {
      from: `${firstName} ${lastName} <${email}>`,
      to: ENV_SMTP_USER,
      subject,
      text: message
    }

    const data = await transporter.sendMail(mailData)

    res.send(data)
  } catch (error) {
    res.status(400).send(error)
  }
}
