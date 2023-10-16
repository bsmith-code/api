import { IRequest, IResponse } from 'types'
import { Request, Response, Send } from 'express'
import { IUser } from 'types/auth'
import { Transaction } from 'sequelize'
import { getTransaction } from 'database'
import { User } from 'models/auth/user'

export const createUser = async (req: Request<IUser>, res: Response<IUser>) => {
  let transaction: Transaction | undefined

  console.log(req)
  try {
    transaction = await getTransaction()

    const result = await User.create(req.body)
  } catch (error) {
    if (transaction) {
      await transaction.rollback()
    }
    throw error
  }
}
