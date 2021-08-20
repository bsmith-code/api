const jwt = require('jsonwebtoken')
const {
  Sequelize: { Op },
  chat: {
    models: { Message, Member }
  }
} = require('../../models')

exports.createMessage = async (req, res) => {
  const {
    headers: { authorization },
    body: { message, roomId }
  } = req
  const accessToken = authorization.split(' ')[1]

  // Get User ID
  const { id: userId } = jwt.decode(accessToken)

  // Get Member ID
  const memberId = Member.findOne({
    where: {
      [Op.and]: {
        userId,
        roomId
      }
    }
  })

  // Compose Message for Response
  const messageObj = await Message.create({
    roomId,
    message,
    memberId
  })

  res.json(messageObj)
}
