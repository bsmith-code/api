const jwt = require('jsonwebtoken')
const {
  Sequelize: { Op },
  chat: {
    models: { Member, Message, Room, User }
  }
} = require('../../models')

exports.getRoomById = async (req, res) => {
  const {
    params: { roomId }
  } = req

  const room = await Room.findByPk(roomId)

  res.json(room)
}

exports.getUserRooms = async (req, res) => {
  const {
    headers: { authorization }
  } = req
  const accessToken = authorization.split(' ')[1]

  // Get User Id from Token
  const { id: userId } = jwt.decode(accessToken)

  // Find Rooms with User ID
  const roomIds = await Member.findAll({
    attributes: ['roomId'],
    where: { userId }
  })
  const rooms = await Room.findAll({
    where: { id: [...roomIds.map(room => room.roomId)] }
  })

  res.json(rooms)
}

exports.createRoom = async (req, res) => {
  try {
    const {
      body: { name, users },
      headers: { authorization }
    } = req
    const date = new Date()
    const accessToken = authorization.split(' ')[1]

    // Get User Id from Token
    const { id: userId } = jwt.decode(accessToken)

    // Find Users
    const foundUserIds = await User.findAll({
      attributes: ['id'],
      where: {
        [Op.or]: {
          email: users,
          username: users
        }
      }
    })

    // Combine foundUserIds with userId
    const userIds = [{ id: userId, acceptedAt: date }, ...foundUserIds]

    // Create Room
    const room = await Room.create({
      name
    })

    // Create Members
    await Member.bulkCreate(
      userIds.map(user => ({
        userId: user.id,
        roomId: room.id,
        invitedAt: date,
        acceptedAt: user.acceptedAt || null
      }))
    )

    res.json(room)
  } catch (error) {
    res.status(500).send({ message: error.message })
    throw error
  }
}

exports.getRoomMemberStatus = async (req, res) => {
  const {
    params: { roomId },
    headers: { authorization }
  } = req
  const accessToken = authorization.split(' ')[1]

  // Get User Id from Token
  const { id: userId } = jwt.decode(accessToken)

  // Find Member
  const member = await Member.findOne({
    where: {
      [Op.and]: {
        roomId,
        userId
      }
    }
  })

  res.json(member)
}

exports.getRoomMembers = async (req, res) => {
  const {
    params: { roomId }
  } = req

  // Find Members
  const members = await Member.findAll({
    where: {
      roomId
    }
  })

  res.json(members)
}

exports.getRoomMessages = async (req, res) => {
  const {
    params: { roomId }
  } = req

  // Find Messages
  const messages = await Message.findAll({
    where: {
      roomId
    }
  })

  res.json(messages)
}

exports.joinRoom = async (req, res) => {
  const {
    params: { roomId },
    headers: { authorization }
  } = req
  const accessToken = authorization.split(' ')[1]

  // Get User Id from Token
  const { id: userId } = jwt.decode(accessToken)

  // Find Member
  const member = await Member.findOne({
    where: {
      [Op.and]: {
        roomId,
        userId
      }
    }
  })

  // Update Member
  member.acceptedAt = new Date()
  await member.save()

  res.json(member)
}