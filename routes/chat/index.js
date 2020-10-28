const router = require('express').Router()
const { chat } = require('../../models')
router.use('/auth', require('./auth.routes.js'))
router.use('/messages', require('./message.routes.js'))
router.use('/rooms', require('./room.routes.js'))

chat
  .sync({ alter: true })
  .then(() => {
    console.log('altered.')
  })
  .catch(err => {
    console.log(err)
  })

module.exports = router
