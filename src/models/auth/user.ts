import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement
} from 'sequelize-typescript'

@Table({ tableName: 'user' })
export class User extends Model {
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  uuid!: string

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

  @CreatedAt
  createdAt?: Date

  @UpdatedAt
  updatedAt?: Date
}
