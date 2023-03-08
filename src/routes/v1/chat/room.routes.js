const roomRouter = require('express').Router()
const { room: roomController } = require('../../controllers/chat')

roomRouter.post('/', roomController.createRoom)
roomRouter.get('/', roomController.getUserRooms)
roomRouter.get('/:roomId', roomController.getRoomById)
roomRouter.put('/:roomId/join', roomController.joinRoom)
roomRouter.get('/:roomId/members', roomController.getRoomMembers)
roomRouter.get('/:roomId/messages', roomController.getRoomMessages)
roomRouter.get('/:roomId/member-status', roomController.getRoomMemberStatus)

module.exports = roomRouter
