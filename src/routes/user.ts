import express from 'express'

import {
  getUsers,
  getUserSession,
  loginUser,
  logoutUser,
  registerUser,
  sendErrorEmail,
  updateUser,
  verifyUser
} from 'controllers/user'

import { validateLoginUser, validateRegisterUser } from 'middleware/auth'

export const userPublicRouter = express.Router()
export const userProtectedRouter = express.Router()

userPublicRouter.post('/logout', logoutUser)
userPublicRouter.get('/verify/:userId', verifyUser)
userPublicRouter.post('/login', validateLoginUser(), loginUser)
userPublicRouter.post('/register', validateRegisterUser(), registerUser)

userProtectedRouter.get('/session', getUserSession)
userProtectedRouter.get('/users', getUsers)
userProtectedRouter.put('/users/:userId', updateUser)
userProtectedRouter.post('/error', sendErrorEmail)
