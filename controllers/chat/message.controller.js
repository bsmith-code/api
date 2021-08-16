const jwt = require('jsonwebtoken')
const {
  Sequelize: { Op },
  chat: {
    models: { Message, Member, Room, User }
  }
} = require('../../models')

exports.create = async (req, res) => {
  const {
    cookies: { access_token },
    body: { message, roomId, userIds }
  } = req

  const { id: userId } = jwt.decode(access_token)

  if (!userIds.length) {
    return res.status(401).send({ message: 'Invalid recipient(s).' })
  }

  const users = await User.findAll({ where: { id: { [Op.or]: [...userIds] } } })

  let room
  if (!roomId) {
    room = await Room.create({
      name: [...users.map(user => `${user.firstName} ${user.lastName}`)].join(
        ', '
      ),
      type: users.length > 1 ? 1 : 0
    })

    await Member.bulkCreate([
      ...users.map(user => ({ userId: user.id, roomId: room.id }))
    ])
  }

  const messageObj = await Message.create({
    message,
    roomId: roomId || room.id,
    userId
  })

  res.status(200).json(messageObj)
}
