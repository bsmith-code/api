import { Response } from 'express'
import { Room } from 'models/chat/room'
import { RoomMembers } from 'models/chat/roomMembers'
import { IRequest } from 'types'

export const getRoomsByUserId = async (req: IRequest, res: Response) => {
  try {
    const {
      locals: { userId }
    } = res

    const rooms = await RoomMembers.findByPk(userId, { include: Room })

    res.json(rooms)
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
