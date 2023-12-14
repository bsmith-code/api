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

import { User } from 'models/user'
import { UserPermissions } from 'models/userPermissions'

@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
}))
@Table
export class Permission extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string

  @BelongsToMany(() => User, {
    through: { model: () => UserPermissions },
    foreignKey: 'permissionId',
    otherKey: 'userId'
  })
  user?: User[]
}
