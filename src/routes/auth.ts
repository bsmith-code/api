// Common
import express from 'express'

// Controllers
import {
  verifyUser,
  registerUser,
  getUserSession,
  authenticateUser
} from 'controllers/auth'

// Middleware
import { validateAuthenticateUser, validateRegisterUser } from 'middleware/auth'

const authRouter = express.Router()

authRouter.get('/session', getUserSession)
authRouter.post('/register', validateRegisterUser(), registerUser)
authRouter.post('/login', validateAuthenticateUser(), authenticateUser)

authRouter.get('/verify/:userId', verifyUser)

export default authRouter
