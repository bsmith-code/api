// Common
import { Response } from 'express'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

// Utils
import { transporter, validateForm, verifyReCaptcha } from 'helpers'

// Types
import { IRequest, IPortfolioEmail } from 'types'

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
      to: process.env.ENV_SMTP_USER,
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
