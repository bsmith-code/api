// Common
import { Sequelize } from 'sequelize-typescript'

// Configs
import { dbConfig } from 'config/index'

// Models
import { User, Token, Permission } from 'models/auth'

const sequelize = new Sequelize(dbConfig)

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

export const close = async () => {
  await sequelize.close()
  console.log('Database connection closed.')
}

export const getTransaction = () => sequelize.transaction()
