// Common
import express from 'express'

// Controllers
import { getPermissions } from 'controllers/auth/permission'

export const permissionRouter = express.Router()

permissionRouter.get('/permissions', getPermissions)
