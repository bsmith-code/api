import express from 'express'

import { getPermissions } from 'controllers/auth/permission'

export const permissionRouter = express.Router()

permissionRouter.get('/permissions', getPermissions)
