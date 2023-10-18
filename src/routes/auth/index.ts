// Common
import express from 'express'

// Controllers
import { createUser, login } from 'controllers/auth'

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/register', createUser)

export default authRouter
