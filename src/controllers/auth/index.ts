import { IRequest, IResponse } from 'types'
import { IUser } from 'types/auth'
import { Transaction } from 'sequelize'
import { getTransaction } from 'database'
import { User } from 'models/auth/user'

export const createUser = async (
  req: IRequest<IUser>,
  res: IResponse<IUser>
) => {
  let transaction: Transaction | undefined
  try {
    const {
      body: { firstName, lastName, email, password }
    } = req

    const matchedUsers = await User.findAll({
      where: { email }
    })

    transaction = await getTransaction()

    const result = await User.create(req.body)
  } catch (error) {
    if (transaction) {
      await transaction.rollback()
    }
    throw error
  }
}
