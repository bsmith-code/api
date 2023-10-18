// Common
import { compareSync, hashSync } from 'bcryptjs'
import { Transaction } from 'sequelize'
import { Response } from 'express'
import { sign } from 'jsonwebtoken'
// DB
import { getTransaction } from 'database'

// Models
import { User } from 'models/auth/user'

// Types
import { IUser, IRequest } from 'types'
import { setAccessToken } from 'helpers/auth'

type TUserResponse = Response<Partial<IUser> | { message: string }>

export const createUser = async (req: IRequest<IUser>, res: TUserResponse) => {
  let transaction: Transaction | undefined
  try {
    const {
      body: { firstName, lastName, email, password }
    } = req

    const matchedUsers = await User.findAll({
      where: { email }
    })

    transaction = await getTransaction()

    if (!matchedUsers.length) {
      const preparedPassword = hashSync(password, 10)

      const user = await User.create({
        email,
        lastName,
        firstName,
        password: preparedPassword
      })

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
    throw error
  }
}

export const login = async (
  req: IRequest<Pick<IUser, 'email' | 'password'>>,
  res: TUserResponse
) => {
  try {
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
      process.env.ENV_TOKEN_SECRET ?? '',
      {
        expiresIn: '30m'
      }
    )

    setAccessToken(accessToken)(res)

    return res.json({
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName
    })
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
    throw error
  }
}
