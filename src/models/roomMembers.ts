import { BelongsTo, ForeignKey, Model, Table } from 'sequelize-typescript'

import { Room } from 'models/room'
import { User } from 'models/user'

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
}
