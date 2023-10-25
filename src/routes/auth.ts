// Common
import express from 'express'

// Controllers
import {
  verifyUser,
  registerUser,
  getUserSession,
  loginUser
} from 'controllers/auth'

// Middleware
import { validateLoginUser, validateRegisterUser } from 'middleware/auth'

const authRouter = express.Router()

authRouter.get('/session', getUserSession)
authRouter.post('/register', validateRegisterUser(), registerUser)
authRouter.post('/login', validateLoginUser(), loginUser)

authRouter.get('/verify/:userId', verifyUser)

export default authRouter
