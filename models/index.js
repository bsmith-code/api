const Sequelize = require('sequelize')
const config = require('../config/db.config.js')

const db = {}
Object.keys(config.databases).map(name => {
  const {
    database,
    username,
    password,
    host,
    dialect,
    pool: { max, min, acquire, idle }
  } = config.databases[name]

  db[name] = new Sequelize(database, username, password, {
    host,
    dialect,
    operatorsAliases: false,
    pool: {
      max,
      min,
      acquire,
      idle
    }
  })
})

module.exports = db
