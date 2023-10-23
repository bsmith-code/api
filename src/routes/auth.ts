// Common
import express from 'express'

// Controllers
import {
  verifyUser,
  verifyEmail,
  registerUser,
  authenticateUser
} from 'controllers/auth'

// Middleware
import { validateAuthenticateUser, validateRegisterUser } from 'middleware/auth'

const authRouter = express.Router()

authRouter.get('/verifyUser', verifyUser)
authRouter.get('/verifyEmail/:userId', verifyEmail)
authRouter.post('/registerUser', validateRegisterUser(), registerUser)
authRouter.post(
  '/authenticateUser',
  validateAuthenticateUser(),
  authenticateUser
)

export default authRouter
