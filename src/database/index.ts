// Configs
import sequelize from 'config/index'

// Models
import { User } from 'models/auth/user'
import { Token } from 'models/auth/token'
import { Permission } from 'models/auth/permission'
import { UserPermissions } from 'models/auth/userPermissions'

export const connect = async () => {
  try {
    await sequelize.authenticate()

    sequelize.addModels([User, Token, Permission, UserPermissions])
    await sequelize.sync({ force: false, alter: true })

    console.log('Database connection established.')
  } catch (error) {
    console.error(
      'The connection to the database could not be established.',
      error
    )
  }
}

export const close = () => sequelize.close()
export const getTransaction = () => sequelize.transaction()
