const roomRouter = require('express').Router()
const { room: roomController } = require('../../controllers/chat')

roomRouter.get('/', roomController.findAll)
roomRouter.post('/', roomController.createRoom)

module.exports = roomRouter
