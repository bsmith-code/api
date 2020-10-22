const router = require('express').Router()
const db = require('../../models')
router.use('/login', require('./login'))
router.use('/logout', require('./logout'))
router.use('/register', require('./register'))

db.chat
  .sync({ force: true })
  .then(() => {
    console.log('Drop and re-sync db.')
  })
  .catch(err => {
    console.log(err)
  })

module.exports = router
