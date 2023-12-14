import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Default,
  DefaultScope,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { Permission } from 'models/permission'
import { Room } from 'models/room'
import { RoomMembers } from 'models/roomMembers'
import { UserPermissions } from 'models/userPermissions'

@DefaultScope(() => ({
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
  permissions!: Permission[]
}
