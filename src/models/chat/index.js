const User = require('./user.model')
const Message = require('./message.model')
const Room = require('./room.model')
const Member = require('./member.model')
const Token = require('./token.model')

module.exports = (seq, Seq) => ({
  User: User(seq, Seq),
  Message: Message(seq, Seq),
  Room: Room(seq, Seq),
  Member: Member(seq, Seq),
  Token: Token(seq, Seq)
})
