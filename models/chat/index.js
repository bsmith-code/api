const User = require('./user.model.js')

module.exports = (seq, Seq) => ({
  User: User(seq, Seq)
})
