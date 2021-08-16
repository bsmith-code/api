const jwt = require('jsonwebtoken')
const {
  Sequelize: { Op },
  chat: {
    models: { Member, Room, User }
  }
} = require('../../models')

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
      body: { name, users }
    } = req

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

    if (foundUserIds) {
      // Create Room
      const room = await Room.create({
        name
      })

      // Create Members
      const members = await Member.bulkCreate(
        foundUserIds.map(user => ({
          userId: user.id,
          roomId: room.id,
          invitedAt: new Date()
        }))
      )

      res.json({
        room,
        members
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
    throw error
  }
}

exports.getMemberStatus = async (req, res) => {
  const {
    params: { roomId },
    headers: { authorization }
  } = req
  const accessToken = authorization.split(' ')[1]

  // Get User Id from Token
  const { id: userId } = jwt.decode(accessToken)

  const member = await Member.findOne({
    where: {
      [Op.and]: {
        roomId,
        userId
      }
    }
  })

  res.json({
    member
  })
}
