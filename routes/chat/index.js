const router = require('express').Router()
const { chat } = require('../../models')
router.use('/auth', require('./auth.routes.js'))

chat
  .sync({ alter: true })
  .then(() => {
    console.log('altered.')
  })
  .catch(err => {
    console.log(err)
  })

module.exports = router
