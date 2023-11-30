import express from 'express'

import { createRoom, getUserRooms } from 'controllers/chat'

import { validateAndRefreshToken } from 'middleware/auth'

const chatRouter = express.Router()

chatRouter.get('/rooms', validateAndRefreshToken, getUserRooms)
chatRouter.post('/rooms', validateAndRefreshToken, createRoom)

export default chatRouter
