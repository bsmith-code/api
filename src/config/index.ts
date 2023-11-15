import { Sequelize } from 'sequelize-typescript'

const sequelize = new Sequelize({
  port: 3306,
  dialect: 'mysql',
  host: process.env.ENV_DB_HOST,
  username: process.env.ENV_DB_USER,
  database: process.env.ENV_DB_NAME,
  password: process.env.ENV_DB_PASSWORD
})

export default sequelize
