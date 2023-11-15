// Common
import express from 'express'

// Controllers
import {
  loginUser,
  verifyUser,
  logoutUser,
  updateUser,
  registerUser,
  getUserSession,
  getUsers
} from 'controllers/auth'

// Middleware
import {
  validateLoginUser,
  validateRegisterUser,
  validateAndRefreshToken
} from 'middleware/auth'

const authRouter = express.Router()

// Protected
authRouter.get('/session', validateAndRefreshToken, getUserSession)
authRouter.get('/users', validateAndRefreshToken, getUsers)
authRouter.put('/users/:userId', validateAndRefreshToken, updateUser)

// Public
authRouter.post('/logout', logoutUser)
authRouter.get('/verify/:userId', verifyUser)
authRouter.post('/login', validateLoginUser(), loginUser)
authRouter.post('/register', validateRegisterUser(), registerUser)

export default authRouter
