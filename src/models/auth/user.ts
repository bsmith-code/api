import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  AllowNull,
  PrimaryKey
} from 'sequelize-typescript'

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
}
