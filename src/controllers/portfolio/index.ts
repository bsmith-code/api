// Common
import nodemailer from 'nodemailer'

// Types
import { IRequest, IResponse, IPortfolioEmail } from 'types'

const transporter = nodemailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: 'brian@brianmatthewsmith.com',
    pass: ''
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
      to: 'brian@brianmatthewsmith.com',
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
