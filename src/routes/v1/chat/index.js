const router = require('express').Router()
const { chat } = require('../../models')
router.use('/auth', require('./auth.routes'))
router.use('/messages', require('./message.routes'))
router.use('/rooms', require('./room.routes'))

chat
  .sync({ alter: true })
  .then(() => {
    console.log('altered.')
  })
  .catch(err => {
    console.log(err)
  })

module.exports = router


// const io = require('socket.io')(httpServer, {})
// const {
//   chat: {
//     models: { Message, User }
//   }
// } = require('../models')

// app.use(cookieParser())
// app.use(express.json())
// app.use(express.urlencoded())

// create a write stream (in append mode)
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, 'access.log'),
//   { flags: 'a' }
// )

// setup the logger
// app.use(morgan('combined', { stream: accessLogStream }))

// io.on('connection', socket => {
//   const emitMessage = messageObj => {
//     io.sockets.emit('create-message', messageObj)
//   }

//   socket.on('create-message', async ({ roomId, message, userId }) => {
//     try {
//       const messageObj = await Message.create({
//         roomId,
//         message,
//         userId
//       })
//       const messageAuthor = await User.findByPk(userId)

//       const preparedResponse = {
//         id: messageObj.dataValues.id,
//         roomId: messageObj.dataValues.roomId,
//         message: messageObj.dataValues.message,
//         createdAt: messageObj.dataValues.createdAt,
//         author: {
//           firstName: messageAuthor.dataValues.firstName,
//           lastName: messageAuthor.dataValues.lastName
//         }
//       }

//       emitMessage(preparedResponse)
//     } catch (error) {
//       console.log('ERROR', error)
//     }
//   })
// })
