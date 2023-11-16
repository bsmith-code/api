import { User } from 'models/auth/user'
import { Permission } from 'models/auth/permission'
import {
  Model,
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  DefaultScope
} from 'sequelize-typescript'

@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
}))
@Table({ tableName: 'userPermissions' })
export class UserPermissions extends Model {
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string

  @BelongsTo(() => User)
  user?: User

  @ForeignKey(() => Permission)
  @Column(DataType.UUID)
  permissionId!: string

  @BelongsTo(() => Permission)
  permission?: Permission
}
