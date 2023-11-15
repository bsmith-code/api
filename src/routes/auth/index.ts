// Common
import express from 'express'

// Routes
import authProtectedRouter from 'routes/auth/authProtected'
import authPublicRouter from 'routes/auth/authPublic'

// Middleware
import { validateAndRefreshToken } from 'middleware/auth'

const authRouter = express.Router()

authRouter.use('/', validateAndRefreshToken, authProtectedRouter)
authRouter.use('/', authPublicRouter)

export default authRouter
