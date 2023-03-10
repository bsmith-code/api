// Common
import nodemailer from 'nodemailer'

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
    const { firstName, lastName, email, subject, message } = req.body

    const mailData = {
      from: `${firstName} ${lastName} <${email}>`,
      to: ENV_SMTP_USER,
      subject,
      text: message
    }

    await transporter.sendMail(mailData)

    res.status(200).send({ message: 'Message sent.' })
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(error.message)
    }
  }
}
