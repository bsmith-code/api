const app = require('express')()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')
const chatRoutes = require('./chat')
const db = require('../models')

const PORT = process.env.ROUTING_PORT || 8080

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// add service routes here
app.use('/chat', chatRoutes)
app.get('/', async (_, res) => {
  res.status(200).json({ message: 'Welcome to the API Gateway.' })
})

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and re-sync db.')
  app.listen(PORT)
})

module.exports = app
