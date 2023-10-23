// Common
import express from 'express'

// Controllers
import { registerUser, authenticateUser, verifyUser } from 'controllers/auth'

// Middleware
import { validateAuthenticateUser, validateRegisterUser } from 'middleware/auth'

const authRouter = express.Router()

authRouter.post('/authenticate', validateAuthenticateUser(), authenticateUser)
authRouter.get('/verify', verifyUser)
authRouter.post('/register', validateRegisterUser(), registerUser)

export default authRouter
