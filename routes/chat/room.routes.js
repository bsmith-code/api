const roomRouter = require('express').Router()
const { room: roomController } = require('../../controllers/chat')

roomRouter.get('/', roomController.getUserRooms)
roomRouter.post('/', roomController.createRoom)
roomRouter.get('/:roomId/member-status', roomController.getMemberStatus)

module.exports = roomRouter
