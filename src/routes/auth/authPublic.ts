// Common
import express from 'express'

// Controllers
import {
  loginUser,
  verifyUser,
  logoutUser,
  registerUser
} from 'controllers/auth'

// Middleware
import { validateLoginUser, validateRegisterUser } from 'middleware/auth'

const authPublicRouter = express.Router()

authPublicRouter.post('/logout', logoutUser)
authPublicRouter.get('/verify/:userId', verifyUser)
authPublicRouter.post('/login', validateLoginUser(), loginUser)
authPublicRouter.post('/register', validateRegisterUser(), registerUser)

export default authPublicRouter
