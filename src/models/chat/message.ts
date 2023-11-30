import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { User } from 'models/auth/user'
import { Room } from 'models/chat/room'

@Table
export class Message extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string

  @ForeignKey(() => Room)
  @Column(DataType.UUID)
  roomId!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  message!: string
}
