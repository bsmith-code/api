import { Sequelize, SequelizeOptions } from 'sequelize-typescript'

const config: SequelizeOptions = {
  database: process.env.ENV_DB_NAME,
  username: process.env.ENV_DB_USER,
  password: process.env.ENV_DB_PASSWORD,
  host: process.env.ENV_DB_HOST,
  dialect: 'mysql'
}

export const local = config
export const production = config

export default new Sequelize(config)
