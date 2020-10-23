const messageRouter = require('express').Router()
const { message: messageController } = require('../../controllers/chat')

messageRouter.post('/', messageController.create)

module.exports = messageRouter
