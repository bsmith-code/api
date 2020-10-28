const roomRouter = require('express').Router()
const { room: roomController } = require('../../controllers/chat')

roomRouter.get('/', roomController.findAll)

module.exports = roomRouter
