const User = require('./user.model.js')
const Message = require('./message.model.js')
const Room = require('./room.model.js')
const Member = require('./member.model.js')
const Token = require('./token.model.js')

module.exports = (seq, Seq) => ({
  User: User(seq, Seq),
  Message: Message(seq, Seq),
  Room: Room(seq, Seq),
  Member: Member(seq, Seq),
  Token: Token(seq, Seq)
})
