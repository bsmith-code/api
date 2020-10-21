const register = require('express').Router()

register.post('/', async (req, res) => {
  res.json(req)
})

module.exports = register
