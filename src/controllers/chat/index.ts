import { Response } from 'express'
import { io } from 'index'

import { User } from 'models/auth/user'
import { Message } from 'models/chat/message'
import { Room } from 'models/chat/room'
import { RoomMembers } from 'models/chat/roomMembers'

import { IRequest } from 'types'

export const getUserRooms = async (req: IRequest, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res

    // Find all rooms associated with current user
    const user = await User.findByPk(userId, { include: [Room] })
    const rooms = user?.rooms ?? []

    // Find all members associated with current user rooms
    const roomMembers = await RoomMembers.findAll({
      where: { roomId: rooms.map(({ id }) => id) },
      include: [User]
    })

    // Find most recent message associated with current room

    // Append array of user objects to rooms object
    const members = roomMembers.map(member => member.user)
    const preparedRooms = rooms
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(({ id, name }) => ({ id, name, members }))

    res.json(preparedRooms)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}

export const createRoom = async (req: IRequest, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res
    const { name, members } = req.body as unknown as {
      name: string
      members: string[]
    }

    const preparedMembers = userId ? [...members, userId] : members

    const room = await Room.create({ name, userId: preparedMembers })
    await room.$add('members', preparedMembers)

    res.json(room)
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
      order: [['createdAt', 'DESC']]
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
    io.emit('message', newMessage)

    res.json(newMessage)
  } catch (error) {
    res.status(400).send({ message: (error as Error).message })
  }
}
