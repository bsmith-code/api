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
    models: { Message, User }
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
  const emitMessage = messageObj => {
    io.sockets.emit('create-message', messageObj)
  }

  socket.on('create-message', async ({ roomId, message, userId }) => {
    try {
      const messageObj = await Message.create({
        roomId,
        message,
        userId
      })
      const messageAuthor = await User.findByPk(userId)

      const preparedResponse = {
        id: messageObj.dataValues.id,
        message: messageObj.dataValues.message,
        createdAt: messageObj.dataValues.createdAt,
        author: {
          firstName: messageAuthor.dataValues.firstName,
          lastName: messageAuthor.dataValues.lastName
        }
      }

      emitMessage(preparedResponse)
    } catch (error) {
      console.log('ERROR', error)
    }
  })
})

// add service routes here
app.use('/chat', chatRoutes)
app.get('/', async (_, res) => {
  res.status(200).json({ message: 'Welcome to the API Gateway.' })
})

httpServer.listen(PORT)
