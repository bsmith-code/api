const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const httpServer = require('http').createServer(app)

const PORT = process.env.ROUTING_PORT || 8080
const io = require('socket.io')(httpServer, {})
const chatRoutes = require('./chat')
const {
  chat: {
    models: { Message }
  }
} = require('../models')

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

io.on('connection', socket => {
  socket.on('create-message', async ({ roomId, message, userId }) => {
    const messageObj = await Message.create({
      roomId,
      message,
      userId
    })

    socket.emit('create-message', messageObj)
  })
})

// add service routes here
app.use('/chat', chatRoutes)
app.get('/', async (_, res) => {
  res.status(200).json({ message: 'Welcome to the API Gateway.' })
})

httpServer.listen(PORT)
