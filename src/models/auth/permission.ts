import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  AllowNull,
  PrimaryKey,
  DefaultScope
} from 'sequelize-typescript'

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
}
