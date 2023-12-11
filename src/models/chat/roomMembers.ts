import { BelongsTo, ForeignKey, Model, Table } from 'sequelize-typescript'

import { User } from 'models/auth/user'
import { Room } from 'models/chat/room'

@Table
export class RoomMembers extends Model {
  @ForeignKey(() => User)
  userId!: string

  @BelongsTo(() => User)
  user?: User

  @ForeignKey(() => Room)
  roomId!: string

  @BelongsTo(() => Room)
  room?: Room

  static primaryKeyAttributes = ['userId', 'roomId'] as const
}
