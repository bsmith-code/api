import { PERMISSIONS_ALL, PERMISSION_SUPER_ADMIN } from 'constants/permissions'
import { Permission } from 'models/auth/permission'
import { UserPermissions } from 'models/auth/userPermissions'
import { User } from 'models/auth/user'
import sequelize from 'config/index'

sequelize.addModels([User, Permission, UserPermissions])

export = {
  up: async () => {
    // Check if the table is empty
    const rowCount = await Permission.count()

    if (rowCount === 0) {
      // Seed data
      const seedData = PERMISSIONS_ALL.map(permission => ({ name: permission }))

      // Bulk insert the seed data into the table
      await Permission.bulkCreate(seedData, { individualHooks: true })
    }

    const superAdminUser = await User.findOne({
      where: { email: process.env.ENV_SUPER_ADMIN }
    })
    const superAdminPerm = await Permission.findOne({
      where: { name: PERMISSION_SUPER_ADMIN }
    })

    if (superAdminUser && superAdminPerm) {
      await superAdminUser.$set('permissions', superAdminPerm.id)
    }
  }
}
