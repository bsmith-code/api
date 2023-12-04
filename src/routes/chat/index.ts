import express from 'express'

import {
  createMessage,
  createRoom,
  getRoomMessages,
  getUserRooms
} from 'controllers/chat'

const chatRouter = express.Router()

chatRouter.get('/rooms', getUserRooms)
chatRouter.get('/rooms/:roomId/messages', getRoomMessages)
chatRouter.post('/rooms', createRoom)
chatRouter.post('/messages', createMessage)

export default chatRouter
