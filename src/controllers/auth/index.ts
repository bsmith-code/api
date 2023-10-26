// Common
import { compareSync, hashSync } from 'bcryptjs'
import { Transaction } from 'sequelize'
import { Response } from 'express'
import { JwtPayload, verify, decode } from 'jsonwebtoken'

// DB
import { getTransaction } from 'database'

// Models
import { User, Token } from 'models/auth'

// Utils
import { cookieOptions, signAccessToken, signRefreshToken } from 'helpers/auth'
import { transporter, validateForm, verifyReCaptcha } from 'helpers/forms'

// Types
import { IAuthUser, IAuthUserCreate, IRequest } from 'types'

type TUserResponse = Response<Partial<IAuthUser> | { message: string }>
const tokenSecret = process.env.ENV_TOKEN_SECRET ?? ''

export const sendVerificationEmail = async ({ id, email }: IAuthUser) => {
  const mailData = {
    from: `noreply@brianmmatthewsmith.com`,
    to: email,
    subject: 'Please Verify Your Email Address',
    html: `
      <a href="http://auth.brianmatthewsmith.local:3002?verifyUser=${id}" target="_blank">Verify Email</a>
    `
  }

  await transporter.sendMail(mailData)
}

export const registerUser = async (
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

      await sendVerificationEmail(user)

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

export const loginUser = async (
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

    const isValidPassword = compareSync(password, user?.password ?? '')

    if (!user || !isValidPassword) {
      throw new Error('Invalid email or password.')
    }

    if (!user.verified) {
      throw new Error('Email is not verified.')
    }

    const accessToken = signAccessToken(user.id)
    const refreshToken = signRefreshToken(accessToken)

    const currentRefreshToken = await Token.findOne({
      where: { userId: user.id }
    })

    if (currentRefreshToken) {
      await Token.destroy({ where: { id: currentRefreshToken.id } })
    }

    await Token.create({ userId: user.id, refreshToken })

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

export const logoutUser = (req: IRequest, res: Response) => {
  try {
    const {
      cookies: { accessToken }
    } = req

    if (!accessToken) {
      throw new Error('User not authenticated.')
    }

    // TODO: Remove refresh token by user id
    const { id } = decode(accessToken) as JwtPayload & {
      id: string
    }

    return res
      .cookie('accessToken', '', { ...cookieOptions, maxAge: -1 })
      .send()
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
  }
}

export const getUserSession = async (req: IRequest, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res

    const user = await User.findByPk(userId as string)

    if (!user) {
      throw new Error('User not found.')
    }

    return res.json({
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName
    })
  } catch (error) {
    return res.status(401).send({ message: (error as Error).message })
  }
}

export const verifyUser = async (req: IRequest<boolean>, res: Response) => {
  let transaction: Transaction | undefined

  try {
    const {
      params: { userId }
    } = req

    transaction = await getTransaction()

    const user = await User.findByPk(userId)
    if (!user) {
      throw new Error('Invalid user id.')
    }

    if (!!user.verified) {
      throw new Error('Email already verified.')
    }

    await user.update({ verified: true })

    return res.json({
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName
    })
  } catch (error) {
    if (transaction) {
      await transaction.rollback()
    }

    return res.status(400).send({ message: (error as Error).message })
  }
}
