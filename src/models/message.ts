import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { Room } from 'models/room'
import { User } from 'models/user'

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
  @Column(DataType.TEXT)
  message!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  isCommand!: boolean

  @BelongsTo(() => Room, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  room!: Room

  @BelongsTo(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user!: User
}
