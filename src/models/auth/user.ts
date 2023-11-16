import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  AllowNull,
  PrimaryKey,
  DefaultScope,
  BelongsToMany,
  BeforeCreate
} from 'sequelize-typescript'
import { Permission } from 'models/auth/permission'
import { UserPermissions } from 'models/auth/userPermissions'

@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt', 'password', 'verified']
  }
}))
@Table({ tableName: 'user' })
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

  @BelongsToMany(() => Permission, () => UserPermissions)
  permissions!: Permission[]

  @BeforeCreate
  static setDefaultValues(instance: User): void {
    if (!instance.permissions) {
      instance.permissions = []
    }
  }
}
