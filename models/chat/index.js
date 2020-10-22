const User = require('./user')

module.exports = (seq, Seq) => ({
  User: User(seq, Seq)
})
