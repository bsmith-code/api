import { Response } from 'express'
import { compareSync, hashSync } from 'bcryptjs'
import { decode, JwtPayload } from 'jsonwebtoken'
import { Transaction } from 'sequelize'

import { getTransaction } from 'database/index'

import { Permission } from 'models/permission'
import { Token } from 'models/token'
import { User } from 'models/user'

import { cookieOptions, signAccessToken, signRefreshToken } from 'utils/auth'
import { transporter, validateForm, verifyReCaptcha } from 'utils/forms'

import { IRequest, IUserClient, IUserServer, TUserCreate } from 'types'

type TUserResponse = Response<Partial<IUserClient> | { message: string }>

export const sendVerificationEmail = async ({
  id,
  email,
  searchParams
}: {
  id: string
  email: string
  searchParams: string
}) => {
  const preparedParams = searchParams
    ? `${searchParams}&verifyUser=${id}`
    : `?verifyUser=${id}`

  const mailData = {
    from: `noreply@brianmmatthewsmith.com`,
    to: email,
    subject: 'Please Verify Your Email Address',
    html: `
      <a href="${
        process.env?.ENV_AUTH_BASE_URL ?? ''
      }${preparedParams}" target="_blank">Verify Email</a>
    `
  }

  await transporter.sendMail(mailData)
}

export const sendErrorEmail = async (
  req: IRequest<{
    host: string
    name: string
    message: string
    stack?: string
  }>,
  res: Response
) => {
  try {
    const {
      body: { host, name, message, stack = '' }
    } = req

    const preparedHost = host.split('.')[0]
    const mailData = {
      from: 'noreply@brianmatthewsmith.com',
      to: 'brian@brianmatthewsmith.com',
      subject: `An error occurred on ${preparedHost}`,
      html: `
        Name: ${name}</br>
        Message: ${message}</br>
        Stack: ${stack}</br>
      `
    }

    await transporter.sendMail(mailData)
    return res.status(200).send('OK')
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
  }
}

export const registerUser = async (
  req: IRequest<TUserCreate>,
  res: TUserResponse
) => {
  let transaction: Transaction | undefined
  try {
    validateForm(req)

    const {
      body: { firstName, lastName, email, password, recaptcha },
      headers: { 'search-params': searchParams }
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

      await sendVerificationEmail({
        id: user.id,
        email: user.email,
        searchParams: searchParams as string
      })

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
  req: IRequest<Pick<IUserServer, 'email' | 'password'>>,
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
      include: [Permission],
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
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      permissions: user.permissions
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

    const user = await User.findByPk(userId, { include: [Permission] })

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

export const updateUser = async (
  req: IRequest<IUserClient>,
  res: TUserResponse
) => {
  let transaction: Transaction | undefined

  try {
    const {
      params: { userId },
      body
    } = req

    transaction = await getTransaction()

    const currentUser = await User.findByPk(userId)

    if (!currentUser) {
      throw new Error('Invalid user id.')
    }

    const permissions = await Permission.findAll({
      where: { id: body.permissions }
    })

    await currentUser.update(body)
    await currentUser.$set('permissions', permissions)

    const updatedUser = (await User.findByPk(userId)) as User

    return res.json(updatedUser)
  } catch (error) {
    if (transaction) {
      await transaction.rollback()
    }

    return res.status(400).send({ message: (error as Error).message })
  }
}
