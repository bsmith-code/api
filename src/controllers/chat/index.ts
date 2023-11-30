import { Response } from 'express'
import { User } from 'models/auth/user'
import { Room } from 'models/chat/room'
import { RoomMembers } from 'models/chat/roomMembers'
import { IRequest } from 'types'

export const getRoomsByUserId = async (req: IRequest, res: Response) => {
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
    const preparedRooms = rooms.map(({ id, name }) => ({ id, name, members }))

    res.json(preparedRooms)
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
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

    const room = await Room.create({ name })
    await room.$set('members', members)

    res.json(room)
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
  }
}
