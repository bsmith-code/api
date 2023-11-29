import { getRoomsByUserId } from 'controllers/chat'
import express from 'express'
import { validateAndRefreshToken } from 'middleware/auth'

const chatRouter = express.Router()

chatRouter.get('/rooms', validateAndRefreshToken, getRoomsByUserId)

export default chatRouter
