// Common
import express from 'express'

// Controllers
import { createUser } from 'controllers/auth'

const authRouter = express.Router()
authRouter.post('/register', createUser)

export default authRouter
