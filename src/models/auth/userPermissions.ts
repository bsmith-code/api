import { User } from 'models/auth/user'
import { Permission } from 'models/auth/permission'
import {
  Model,
  Table,
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
  userId!: string

  @BelongsTo(() => User)
  user?: User

  @ForeignKey(() => Permission)
  permissionId!: string

  @BelongsTo(() => Permission)
  permission?: Permission
}
