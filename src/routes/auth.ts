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
authRouter.post('/logout', logoutUser)

// Public
authRouter.post('/register', validateRegisterUser(), registerUser)
authRouter.post('/login', validateLoginUser(), loginUser)
authRouter.get('/verify/:userId', verifyUser)

export default authRouter
