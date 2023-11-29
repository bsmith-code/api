import { User } from 'models/auth/user'
import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  AllowNull,
  PrimaryKey,
  BelongsToMany
} from 'sequelize-typescript'
import { RoomMembers } from 'models/chat/roomMembers'
import { IUserServer } from 'types'

@Table
export class Room extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string

  @AllowNull(true)
  @Column(DataType.STRING)
  name!: string

  @BelongsToMany(() => User, {
    through: { model: () => RoomMembers },
    foreignKey: 'roomId',
    otherKey: 'userId'
  })
  members!: IUserServer[]
}
