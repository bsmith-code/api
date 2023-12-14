import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

import { User } from 'models/user'

@Table
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
}
