const logout = require('express').Router()

logout.post('/', async (req, res) => {
  res.json(req)
})

module.exports = logout
