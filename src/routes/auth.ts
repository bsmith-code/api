import express from 'express'

import { permissionRouter } from 'routes/permission'
import { userProtectedRouter, userPublicRouter } from 'routes/user'

import { validateAndRefreshToken } from 'middleware/auth'

const authRouter = express.Router()

authRouter.use('/', userPublicRouter)
authRouter.use('/', validateAndRefreshToken, userProtectedRouter)

authRouter.use('/', validateAndRefreshToken, permissionRouter)

export default authRouter
