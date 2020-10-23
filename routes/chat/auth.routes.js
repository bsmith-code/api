const authRouter = require('express').Router()
const { auth: authController } = require('../../controllers/chat')

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)

module.exports = authRouter
