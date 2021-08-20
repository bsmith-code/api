const messageRouter = require('express').Router()
const { message: messageController } = require('../../controllers/chat')

messageRouter.post('/', messageController.createMessage)

module.exports = messageRouter
