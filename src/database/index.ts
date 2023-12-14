import sequelize from 'config/index'

import { Permission } from 'models/auth/permission'
import { Token } from 'models/auth/token'
import { User } from 'models/auth/user'
import { UserPermissions } from 'models/auth/userPermissions'
import { Message } from 'models/chat/message'
import { Room } from 'models/chat/room'
import { RoomMembers } from 'models/chat/roomMembers'

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
