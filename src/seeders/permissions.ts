import { PERMISSIONS_ALL } from 'constants/permissions'
import { QueryInterface } from 'sequelize'

export = {
  up: async (queryInterface: QueryInterface) => {
    const Permission = queryInterface.sequelize.models.Permission

    console.log(queryInterface.sequelize.models)
    // Check if the table is empty
    const rowCount = await Permission.count()

    if (rowCount === 0) {
      // Seed data
      const seedData = PERMISSIONS_ALL.map(permission => ({ name: permission }))

      // Bulk insert the seed data into the table
      await Permission.bulkCreate(seedData, { individualHooks: true })
    }
  }
}
