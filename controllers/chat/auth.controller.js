const bcrypt = require('bcryptjs')
const {
  Sequelize: Op,
  chat: {
    models: { User }
  }
} = require('../../models')

exports.register = async (req, res) => {
  try {
    const {
      body: { firstName, lastName, username, email, password }
    } = req
    const query = Op.or({ username }, { email })
    const matchedUsers = await User.findAll(query)

    if (!matchedUsers.length) {
      const passwordHash = bcrypt.hashSync(password, 10)
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password: passwordHash
      })

      return res.json({
        user: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      })
    }
    return res.status(401).send({ message: 'Username or email unavailable.' })
  } catch (error) {
    console.log(error)
  }
}

exports.login = async (req, res) => {
  try {
    const {
      body: { username, password }
    } = req
    const user = await User.findOne({
      where: {
        username
      }
    })

    if (!user) {
      return res.status(401).send({ message: 'Invalid username or password.' })
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password)

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid username or password.' })
    }

    return res.json({
      user: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    })
  } catch (error) {
    console.log(error)
  }
}

exports.logout = async (req, res) => {}
