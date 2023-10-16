import {
  Model,
  Table,
  Column,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  PrimaryKey
} from 'sequelize-typescript'

@Table({ tableName: 'user' })
export class User extends Model {
  @PrimaryKey
  @Column(DataType.UUIDV4)
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
