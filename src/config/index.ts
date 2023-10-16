import { SequelizeOptions } from 'sequelize-typescript'

export const dbConfig: SequelizeOptions = {
  database: process.env.ENV_DB_NAME,
  username: process.env.ENV_DB_USER,
  password: process.env.ENV_DB_PASSWORD,
  dialect: 'mysql'
}
