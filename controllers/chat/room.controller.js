const jwt = require('jsonwebtoken')
const {
  Sequelize: { Op },
  chat: {
    models: { Member, Room }
  }
} = require('../../models')

exports.findAll = async (req, res) => {
  const {
    cookies: { access_token: accessToken }
  } = req
  const { id: userId } = jwt.decode(accessToken)

  const roomIds = await Member.findAll({ attributes: ['roomId'], where: { userId } })
  const rooms = await Room.findAll({
    where: { id: { [Op.or]: [...roomIds.map(room => room.roomId)] } }
  })

  res.json(rooms)
}
