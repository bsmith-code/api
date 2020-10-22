const {
  chat: {
    models: { User }
  }
} = require('../../../models')

const create = async data => {
  const user = await User.create({
    ...data
  })

  const {
    dataValues: { password, ...rest }
  } = { ...user }

  return rest
}

const findAll = query => {
  return User.findAll({ where: query })
}

const findOne = data => {}

const update = data => {}

const remove = data => {}

const removeAll = data => {}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
  removeAll
}
