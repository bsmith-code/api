// Common
import { Sequelize } from 'sequelize-typescript'

// Configs
import { dbConfig } from 'config'

// Models
import { User } from 'models/auth/user'

const sequelize = new Sequelize(dbConfig)

export const connect = async () => {
  try {
    await sequelize.authenticate()
    sequelize.addModels([User])
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
