import express from 'express'

import { createRoom, getUserRooms } from 'controllers/chat'

const chatRouter = express.Router()

chatRouter.get('/rooms', getUserRooms)
chatRouter.post('/rooms', createRoom)

export default chatRouter
