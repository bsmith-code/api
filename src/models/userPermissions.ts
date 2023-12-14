import {
  BelongsTo,
  DefaultScope,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'

import { Permission } from 'models/permission'
import { User } from 'models/user'

@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
}))
@Table
export class UserPermissions extends Model {
  @ForeignKey(() => User)
  userId!: string

  @BelongsTo(() => User)
  user?: User

  @ForeignKey(() => Permission)
  permissionId!: string

  @BelongsTo(() => Permission)
  permission?: Permission

  static primaryKeyAttributes = ['userId', 'permissionId'] as const
}
