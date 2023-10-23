// Common
import express from 'express'

// Controllers
import { createUser, authenticateUser, verifyUser } from 'controllers/auth'

// Middleware
import { validateAuthenticateUser, validateCreateUser } from 'middleware/auth'

const authRouter = express.Router()

authRouter.post('/login', validateAuthenticateUser(), authenticateUser)
authRouter.get('/status', verifyUser)
authRouter.post('/register', validateCreateUser(), createUser)

export default authRouter
