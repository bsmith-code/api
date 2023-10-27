// Common
import express from 'express'

// Controllers
import {
  loginUser,
  verifyUser,
  logoutUser,
  registerUser,
  getUserSession
} from 'controllers/auth'

// Middleware
import {
  validateAndRefreshToken,
  validateLoginUser,
  validateRegisterUser
} from 'middleware/auth'

const authRouter = express.Router()

// Protected
authRouter.get('/session', validateAndRefreshToken, getUserSession)

// Public
authRouter.post('/logout', logoutUser)
authRouter.get('/verify/:userId', verifyUser)
authRouter.post('/login', validateLoginUser(), loginUser)
authRouter.post('/register', validateRegisterUser(), registerUser)

export default authRouter
