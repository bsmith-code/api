const {
  Sequelize: { Op },
  chat: {
    models: { Message, Member, Room, User }
  }
} = require('../../models')

exports.create = async (req, res) => {
  const {
    // cookie: { access_token },
    body: { message, roomId, userIds }
  } = req

  if (!userIds.length) {
    return res.status(401).send({ message: 'Invalid recipient(s).' })
  }

  const users = await User.findAll({ where: { id: { [Op.or]: [...userIds] } } })

  let room
  if (!roomId) {
    room = await Room.create({
      name: [...users.map(user => `${user.firstName} ${user.lastName}`)].join(', '),
      type: users.length > 1 ? 1 : 0
    })

    await Member.bulkCreate([...users.map(user => ({ userId: user.id, roomId: room.id }))])
  }

  const messageObj = await Message.create({
    message,
    roomId: roomId || room.id,
    userId: '8acd58f3-6dc3-424a-8300-8ba2aae39e3b'
  })

  res.status(200).json(messageObj)
}
