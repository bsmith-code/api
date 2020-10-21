const login = require('express').Router()

login.post('/', async (req, res) => {
  res.json(req)
})
