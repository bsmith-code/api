import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  AllowNull,
  PrimaryKey,
  ForeignKey
} from 'sequelize-typescript'

import { Room } from 'models/chat/room'
import { User } from 'models/auth/user'

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
