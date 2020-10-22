module.exports = {
  databases: {
    chat: {
      database: process.env.CHAT_DB_NAME,
      username: process.env.CHAT_DB_USER,
      password: process.env.CHAT_DB_PASS,
      host: process.env.CHAT_DB_HOST,
      port: process.env.CHAT_DB_PORT,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  }
}
