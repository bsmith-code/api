const register = require('express').Router()
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const user = require('../../../controllers/chat')

register.post('/', async (req, res) => {
  try {
    const {
      body: { firstName, lastName, username, email, password }
    } = req
    const query = Sequelize.or({ username }, { email })
    const matchedUsers = await user.findAll(query)

    if (!matchedUsers.length) {
      const passwordHash = bcrypt.hashSync(password, 10)
      const response = await user.create({
        firstName,
        lastName,
        username,
        email,
        password: passwordHash
      })

      res.json(response)
    } else {
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = register
