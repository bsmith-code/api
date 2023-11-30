import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  AllowNull,
  PrimaryKey,
  DefaultScope,
  BelongsToMany
} from 'sequelize-typescript'

import { Permission } from 'models/auth/permission'
import { UserPermissions } from 'models/auth/userPermissions'

import { IPermission } from 'types/permission'
import { Room } from 'models/chat/room'
import { RoomMembers } from 'models/chat/roomMembers'
import { IRoom } from 'types'

@DefaultScope(() => ({
  include: [
    {
      model: Permission,
      attributes: ['id', 'name']
    }
  ],
  attributes: {
    exclude: ['createdAt', 'updatedAt', 'password', 'verified']
  }
}))
@Table
export class User extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  firstName!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  lastName!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  verified!: boolean

  @BelongsToMany(() => Permission, {
    through: { model: () => UserPermissions },
    foreignKey: 'userId',
    otherKey: 'permissionId'
  })
  permissions!: IPermission[]

  @BelongsToMany(() => Room, {
    through: { model: () => RoomMembers },
    foreignKey: 'userId',
    otherKey: 'roomId'
  })
  rooms!: IRoom[]
}
