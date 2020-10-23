const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const randToken = require('rand-token')

const { setTokens, clearTokens } = require('../../helpers/handleTokens')
const {
  Sequelize: { Op },
  chat: {
    models: { User }
  }
} = require('../../models')

exports.register = async (req, res) => {
  try {
    const {
      body: { firstName, lastName, username, email, password }
    } = req
    const matchedUsers = await User.findAll({ where: { [Op.or]: { username, email } } })

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
  } catch (err) {
    res.status(500).send({ message: err.message })
    throw err
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

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 86400 // 24 hours
    })
    const refreshToken = randToken.uid(256)
    setTokens(accessToken, refreshToken, res)

    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    })
  } catch (err) {
    res.status(500).send({ message: err.message })
    throw err
  }
}

exports.logout = async (req, res) => {
  try {
    const {
      cookies: { access_token: access, refresh_token: refresh }
    } = req

    if (access && refresh) {
      clearTokens(res)
      return res.status(200)
    }

    return res.status(401)
  } catch (err) {
    res.status(500).send({ message: err.message })
    throw err
  }
}
