import { Response } from 'express'
import { io } from 'index'

import { User } from 'models/auth/user'
import { Message } from 'models/chat/message'
import { Room } from 'models/chat/room'
import { RoomMembers } from 'models/chat/roomMembers'

import { IRequest, IRoomCreate, IRoomUpdate } from 'types'

export const getUserRooms = async (req: IRequest, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res

    // Find all rooms associated with current user
    const self = await User.findByPk(userId, { include: [Room] })
    const rooms = self?.rooms ?? []

    // Find all members associated with current user rooms
    const roomMembers = await RoomMembers.findAll({
      where: { roomId: rooms.map(({ id }) => id) },
      include: [User, Room]
    })

    // Find most recent message associated with current room

    const preparedRooms = rooms
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(({ id, name }) => ({
        id,
        name,
        members: roomMembers
          .filter(({ room }) => room?.id === id)
          .map(({ user }) => user)
      }))

    res.json(preparedRooms)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}

export const createRoom = async (req: IRequest<IRoomCreate>, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res
    const { name, members } = req.body

    const preparedMembers = userId ? [...members, userId] : members

    const room = await Room.create({ name, userId: preparedMembers })
    await room.$add('members', preparedMembers)

    const createdRoom = await Room.findByPk(room.id, { include: [User] })

    io.emit('createRoom', createdRoom)
    res.json(createdRoom)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}

export const updateRoom = async (req: IRequest<IRoomUpdate>, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res
    const { id, name, members } = req.body

    const roomMember = await RoomMembers.findOne({
      where: { userId, roomId: id }
    })

    if (!roomMember) {
      throw new Error('Invalid room.')
    }

    const room = await Room.findByPk(id)

    if (!room) {
      throw new Error('Invalid room id.')
    }

    await room.update({ name })
    await room.$set('members', members)

    const updatedRoom = await Room.findByPk(id)

    io.emit('updateRoom', updatedRoom)
    res.json(updatedRoom)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}

export const getRoomMessages = async (req: IRequest, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res
    const {
      params: { roomId }
    } = req

    const messages = await Message.findAll({
      where: { roomId },
      order: [['createdAt', 'ASC']]
    })

    res.json(messages)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}

export const createMessage = async (req: IRequest<Message>, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res
    const {
      body: { message, roomId }
    } = req

    if (!roomId) {
      throw new Error('RoomId is required.')
    }
    if (!message) {
      throw new Error('Message is required.')
    }

    const newMessage = await Message.create({ message, roomId, userId })
    io.emit('createMessage', newMessage)

    res.json(newMessage)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}
