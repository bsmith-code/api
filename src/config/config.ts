import { Sequelize } from 'sequelize-typescript'
import { config } from 'dotenv'

// Load environment variables
config({ path: process.env.ENVIRONMENT === 'local' ? '.env.local' : '.env' })

console.log('DOYOUSEEME', process.env.DB_HOST)

// Define Sequelize Configuration
const sequelize = new Sequelize({
  port: 3306,
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
})

export default sequelize
