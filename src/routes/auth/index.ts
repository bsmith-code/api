// Common
import express from 'express'

// Routes

import { permissionRouter } from 'routes/auth/permission'
import { userPublicRouter, userProtectedRouter } from 'routes/auth/user'

// Middleware
import { validateAndRefreshToken } from 'middleware/auth'

const authRouter = express.Router()

authRouter.use('/', userPublicRouter)
authRouter.use('/', validateAndRefreshToken, userProtectedRouter)

authRouter.use('/', validateAndRefreshToken, permissionRouter)

export default authRouter
