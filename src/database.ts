import sequelize from 'config/index'

import { Message } from 'models/message'
import { Permission } from 'models/permission'
import { Room } from 'models/room'
import { RoomMembers } from 'models/roomMembers'
import { Token } from 'models/token'
import { User } from 'models/user'
import { UserPermissions } from 'models/userPermissions'

export const connect = async () => {
  try {
    await sequelize.authenticate()

    sequelize.addModels([
      User,
      Token,
      Permission,
      UserPermissions,
      Message,
      Room,
      RoomMembers
    ])
    await sequelize.sync({ force: false, alter: true })

    console.log('Database connection established.')
  } catch (error) {
    console.error(
      'The connection to the database could not be established.',
      error
    )
  }
}

export const close = () => sequelize.close()
export const getTransaction = () => sequelize.transaction()
