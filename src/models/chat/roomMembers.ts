import {
  Model,
  Table,
  BelongsTo,
  ForeignKey,
  DefaultScope
} from 'sequelize-typescript'

import { Room } from 'models/chat/room'
import { User } from 'models/auth/user'

@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
}))
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
