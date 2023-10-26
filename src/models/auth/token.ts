// Common
import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  AllowNull,
  PrimaryKey,
  ForeignKey
} from 'sequelize-typescript'

// Models
import { User } from 'models/auth'

@Table({ tableName: 'token' })
export class Token extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  refreshToken!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  accessTokenId!: string
}
