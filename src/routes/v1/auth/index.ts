// Common
import express from 'express'

// Controllers
import { postRegister } from 'controllers/auth'

const authRouter = express.Router()
authRouter.post('/register', postRegister)