const Sequelize = require('sequelize')
const { readdirSync, lstatSync } = require('fs')
const { join } = require('path')
const config = require('../config/db.config')

const models = readdirSync('./models').filter(folder =>
  lstatSync(join('./models', folder)).isDirectory()
)
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
    pool: {
      max,
      min,
      acquire,
      idle
    }
  })
})

models.map(name => {
  const database = db[name]
  const model = join(`${__dirname}/${name}`, 'index.js')
  database.models = {
    ...require(model)(database, Sequelize)
  }
})

db.Sequelize = Sequelize

module.exports = db
