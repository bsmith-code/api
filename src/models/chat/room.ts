import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { User } from 'models/auth/user'
import { RoomMembers } from 'models/chat/roomMembers'

@Table
export class Room extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  description!: string

  @BelongsToMany(() => User, {
    through: { model: () => RoomMembers },
    foreignKey: 'roomId',
    otherKey: 'userId'
  })
  members!: User[]
}
