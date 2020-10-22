module.exports = (sequelize, { DataTypes }) =>
  sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: DataTypes.STRING,
      allowNull: false
    },
    {
      // Other model options go here
    }
  )
