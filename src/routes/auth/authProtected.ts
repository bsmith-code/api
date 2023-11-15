// Common
import express from 'express'

// Controllers
import { updateUser, getUserSession, getUsers } from 'controllers/auth'

const authProtectedRouter = express.Router()

authProtectedRouter.get('/session', getUserSession)
authProtectedRouter.get('/users', getUsers)
authProtectedRouter.put('/users/:userId', updateUser)

export default authProtectedRouter
