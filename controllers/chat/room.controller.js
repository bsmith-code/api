const jwt = require('jsonwebtoken')
const {
  Sequelize: { Op },
  chat: {
    models: { Member, Room, User }
  }
} = require('../../models')

exports.findAll = async (req, res) => {
  const {
    headers: { authorization }
  } = req
  const accessToken = authorization.split(' ')[1]

  const { id: userId } = jwt.decode(accessToken)

  const roomIds = await Member.findAll({
    attributes: ['roomId'],
    where: { userId }
  })
  const rooms = await Room.findAll({
    where: { id: { [Op.or]: [...roomIds.map(room => room.roomId)] } }
  })

  res.json(rooms)
}

exports.createRoom = async (req, res) => {
  try {
    const {
      body: { users }
    } = req

    const userIds = await User.findAll({
      attributes: ['id'],
      where: {
        username: users
      }
    })

    console.log(userIds)

    res.json(userIds)
  } catch (error) {
    res.status(500).send({ message: error.message })
    throw error
  }
}
