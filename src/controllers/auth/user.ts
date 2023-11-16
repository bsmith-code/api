// Common
import { compareSync, hashSync } from 'bcryptjs'
import { Transaction } from 'sequelize'
import { Response } from 'express'
import { JwtPayload, decode } from 'jsonwebtoken'

// DB
import { getTransaction } from 'database/index'

// Models
import { User, Token } from 'models/auth'

// Utils
import { cookieOptions, signAccessToken, signRefreshToken } from 'helpers/auth'
import { transporter, validateForm, verifyReCaptcha } from 'helpers/forms'

// Types
import { IAuthUser, IAuthUserCreate, IRequest, IUser } from 'types'

type TUserResponse = Response<Partial<IAuthUser> | { message: string }>

export const sendVerificationEmail = async ({ id, email }: IAuthUser) => {
  const mailData = {
    from: `noreply@brianmmatthewsmith.com`,
    to: email,
    subject: 'Please Verify Your Email Address',
    html: `
      <a href="${
        process.env?.ENV_AUTH_BASE_URL ?? ''
      }?verifyUser=${id}" target="_blank">Verify Email</a>
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

      return res.json(user)
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
      },
      attributes: { include: ['password', 'verified'] }
    })

    const isValidPassword = compareSync(password, user?.password ?? '')

    if (!user || !isValidPassword) {
      throw new Error('Invalid email or password.')
    }

    if (!user.verified) {
      throw new Error('Email is not verified.')
    }

    const accessToken = signAccessToken(user.id)
    const refreshToken = signRefreshToken()

    const currentRefreshToken = await Token.findOne({
      where: { userId: user.id }
    })

    if (currentRefreshToken) {
      await Token.destroy({ where: { id: currentRefreshToken.id } })
    }

    await Token.create({
      userId: user.id,
      refreshToken
    })

    return res.cookie('accessToken', accessToken, cookieOptions).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
  }
}

export const logoutUser = async (req: IRequest, res: Response) => {
  try {
    const {
      cookies: { accessToken }
    } = req

    if (!accessToken) {
      throw new Error('User not authenticated.')
    }

    const { userId } = decode(accessToken) as JwtPayload
    await Token.destroy({ where: { userId } })

    return res
      .cookie('accessToken', '', { ...cookieOptions, maxAge: -1 })
      .send()
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
  }
}

export const getUserSession = async (req: IRequest, res: TUserResponse) => {
  try {
    const {
      locals: { userId }
    } = res

    const user = await User.findByPk(userId)

    if (!user) {
      throw new Error('User not found.')
    }

    return res.json(user)
  } catch (error) {
    return res.status(401).send({ message: (error as Error).message })
  }
}

export const verifyUser = async (
  req: IRequest<boolean>,
  res: TUserResponse
) => {
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

    return res.json(user)
  } catch (error) {
    if (transaction) {
      await transaction.rollback()
    }

    return res.status(400).send({ message: (error as Error).message })
  }
}

export const getUsers = async (req: IRequest, res: Response) => {
  try {
    const users = await User.findAll()

    return res.json(users)
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
  }
}

export const updateUser = async (req: IRequest, res: TUserResponse) => {
  let transaction: Transaction | undefined

  try {
    const {
      params: { userId },
      body
    } = req

    transaction = await getTransaction()

    const user = await User.findByPk(userId)
    if (!user) {
      throw new Error('Invalid user id.')
    }

    await user.update(body as unknown as IAuthUser)

    return res.json(user)
  } catch (error) {
    if (transaction) {
      await transaction.rollback()
    }

    return res.status(400).send({ message: (error as Error).message })
  }
}
