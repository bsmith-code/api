// Configs
import sequelize from 'config/index'

// Models
import { User, Token, Permission } from 'models/auth'

export const connect = async () => {
  try {
    await sequelize.authenticate()

    sequelize.addModels([User, Token, Permission])
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
