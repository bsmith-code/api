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

import { Message } from 'models/message'
import { RoomMembers } from 'models/roomMembers'
import { User } from 'models/user'

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
