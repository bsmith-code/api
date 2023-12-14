import { Response } from 'express'
import { io } from 'server'

import { Message } from 'models/message'
import { Room } from 'models/room'
import { RoomMembers } from 'models/roomMembers'
import { User } from 'models/user'

import { prepareMembers } from 'utils/chat'

import { IRequest, IRoomRequest } from 'types'

export const getUserRooms = async (req: IRequest, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res

    const self = await RoomMembers.findAll({
      where: { userId },
      include: [Room]
    })

    const rooms = self.map(({ room }) => room as Room)

    const preparedRooms = await Promise.all(
      rooms
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(async ({ id, name, description }) => {
          const message =
            (await Message.findOne({
              where: { roomId: id },
              order: [['createdAt', 'DESC']]
            })) ?? {}

          const members = await RoomMembers.findAll({
            where: { roomId: id },
            include: [User]
          })

          const preparedMembers = members.map(({ user }) => ({
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email
          }))

          return {
            id,
            name,
            message,
            description,
            members: preparedMembers
          }
        })
    )

    res.json(preparedRooms)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}

export const createRoom = async (
  req: IRequest<IRoomRequest>,
  res: Response
) => {
  try {
    const {
      locals: { userId }
    } = res
    const { name, description, members } = req.body

    if (!userId) {
      throw new Error('Invalid user.')
    }

    const preparedMembers = prepareMembers(members, userId)

    if (preparedMembers.length < 2) {
      throw new Error('Must have at least 1 member.')
    }

    const room = await Room.create({
      name,
      description
    })
    await room.$set('members', preparedMembers)

    const createdRoom = await Room.findByPk(room.id, {
      include: [User]
    })

    if (!createdRoom) {
      throw new Error('Invalid room.')
    }

    const preparedRoom = {
      ...createdRoom.toJSON<Room>(),
      message: {}
    }

    io.emit('createRoom', preparedRoom)
    res.json(preparedRoom)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}

export const updateRoom = async (
  req: IRequest<IRoomRequest>,
  res: Response
) => {
  try {
    const {
      locals: { userId }
    } = res
    const { id, name, description, members } = req.body

    if (!userId) {
      throw new Error('Invalid user.')
    }

    const preparedMembers = prepareMembers(members, userId)

    if (preparedMembers.length < 2) {
      throw new Error('Must have at least 1 member.')
    }

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

    await room.update({ name, description })
    await room.$set('members', preparedMembers)

    const updatedRoom = await Room.findByPk(id, { include: [User] })

    if (!updatedRoom) {
      throw new Error('Invalid room.')
    }

    const message = await Message.findOne({
      where: { roomId: updatedRoom.id },
      order: [['createdAt', 'DESC']]
    })

    const preparedRoom = {
      ...updatedRoom.toJSON<Room>(),
      message: message ?? {}
    }

    io.emit('updateRoom', preparedRoom)
    res.json(preparedRoom)
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

    const roomMember = await RoomMembers.findOne({
      where: { userId, roomId }
    })

    if (!roomMember) {
      throw new Error('Invalid room.')
    }

    const messages = await Message.findAll({
      where: { roomId },
      order: [['createdAt', 'ASC']],
      include: [User]
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

    const roomMember = await RoomMembers.findOne({
      where: { userId, roomId }
    })

    if (!roomMember) {
      throw new Error('Invalid room.')
    }

    if (!message) {
      throw new Error('Message is required.')
    }

    const newMessage = await Message.create({ message, roomId, userId })
    const createdMessage = await Message.findByPk(newMessage.id, {
      include: [User]
    })

    io.emit('createMessage', createdMessage)
    res.json(createdMessage)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}
