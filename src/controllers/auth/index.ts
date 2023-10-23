// Common
import { compareSync, hashSync } from 'bcryptjs'
import { Transaction } from 'sequelize'
import { Response } from 'express'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

// DB
import { getTransaction } from 'database'

// Models
import { User } from 'models/auth/user'

// Utils
import { cookieOptions } from 'helpers/auth'
import { transporter, validateForm, verifyReCaptcha } from 'helpers/forms'

// Types
import { IAuthUser, IAuthUserCreate, IRequest } from 'types'

type TUserResponse = Response<Partial<IAuthUser> | { message: string }>
const tokenSecret = process.env.ENV_TOKEN_SECRET ?? ''

export const verifyEmail = async ({ id, email }: IAuthUser) => {
  const mailData = {
    from: `noreply@brianmmatthewsmith.com`,
    to: email,
    subject: 'Please Verify Your Email Address',
    html: `
      <a href="auth.brianmatthewsmith.local:3002?verifyEmail=${id}

    `
  }

  await transporter.sendMail(mailData)
}

export const createUser = async (
  req: IRequest<IAuthUserCreate>,
  res: TUserResponse
) => {
  let transaction: Transaction | undefined
  try {
    validateForm(req)

    const {
      body: { firstName, lastName, email, password, recaptcha }
    } = req

    transaction = await getTransaction()

    const matchedUsers = await User.findAll({
      where: { email }
    })

    if (!matchedUsers.length) {
      await verifyReCaptcha(recaptcha)
      const preparedPassword = hashSync(password, 10)

      const user = await User.create({
        email,
        lastName,
        firstName,
        password: preparedPassword
      })

      await verifyEmail(user)

      return res.json({
        id: user.id,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName
      })
    }

    return res.status(400).send({ message: 'Email unavailable.' })
  } catch (error) {
    if (transaction) {
      await transaction.rollback()
    }

    return res.status(400).send({ message: (error as Error).message })
  }
}

export const authenticateUser = async (
  req: IRequest<Pick<IAuthUser, 'email' | 'password'>>,
  res: TUserResponse
) => {
  try {
    validateForm(req)

    const {
      body: { email, password }
    } = req

    const user = await User.findOne({
      where: {
        email
      }
    })

    if (!user) {
      return res.status(400).send({ message: 'Invalid email or password.' })
    }

    const isValidPassword = compareSync(password, user.password)
    if (!isValidPassword) {
      return res.status(401).send({ message: 'Invalid email or password.' })
    }

    const accessToken = sign(
      {
        id: user.id
      },
      tokenSecret,
      {
        expiresIn: '30m'
      }
    )

    return res.cookie('accessToken', accessToken, cookieOptions).json({
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName
    })
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
  }
}

export const verifyUser = async (req: IRequest<string>, res: Response) => {
  try {
    const {
      cookies: { accessToken }
    } = req

    if (!accessToken) {
      return res.status(400).send({ message: 'User not authenticated.' })
    }

    const { id } = verify(accessToken, tokenSecret) as JwtPayload & {
      id: string
    }
    const user = await User.findByPk(id)

    return res.json(user)
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
  }
}
