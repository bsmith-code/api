const router = require('express').Router()
const { chat } = require('../../models')
router.use('/auth', require('./auth.routes'))
router.use('/messages', require('./message.routes'))
router.use('/rooms', require('./room.routes'))

chat
  .sync({ alter: true })
  .then(() => {
    console.log('altered.')
  })
  .catch(err => {
    console.log(err)
  })

module.exports = router
