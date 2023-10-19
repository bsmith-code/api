// Common
import express from 'express'

// Controllers
import { userCreate, userLogin, userStatus } from 'controllers/auth'

const authRouter = express.Router()

authRouter.post('/login', userLogin)
authRouter.get('/status', userStatus)
authRouter.post('/register', userCreate)

export default authRouter
