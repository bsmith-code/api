// Common
import { Response } from 'express'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

// Utils
import { validateForm, verifyReCaptcha } from 'helpers'

// Types
import { IRequest, IPortfolioEmail } from 'types'

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
  req: IRequest<IPortfolioEmail>,
  res: Response<SMTPTransport.SentMessageInfo | { message: string }>
) => {
  try {
    validateForm(req)
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

    return res.status(400).send({ message })
  }
}
