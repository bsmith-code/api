import express from 'express'

import {
  createMessage,
  createRoom,
  getRoomMessages,
  getUserRooms,
  updateRoom
} from 'controllers/chat'

const chatRouter = express.Router()

chatRouter.get('/rooms', getUserRooms)
chatRouter.get('/rooms/:roomId/messages', getRoomMessages)
chatRouter.post('/rooms', createRoom)
chatRouter.put('/rooms', updateRoom)
chatRouter.post('/messages', createMessage)

export default chatRouter
