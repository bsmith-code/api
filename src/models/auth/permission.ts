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
import { User } from 'models/auth/user'
import { UserPermissions } from 'models/auth/userPermissions'

@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
}))
@Table({ tableName: 'permission' })
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
