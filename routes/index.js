const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')
const chatRoutes = require('./chat')

const app = express()
const PORT = process.env.ROUTING_PORT || 8080

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// add service routes here
app.use('/chat', chatRoutes)
app.get('/', async (_, res) => {
  res.status(200).json({ message: 'Welcome to the API Gateway.' })
})

app.listen(PORT)

module.exports = app
