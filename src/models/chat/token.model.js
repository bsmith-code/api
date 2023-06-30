module.exports = (seq, { DataTypes, UUIDV4 }) =>
  seq.define(
    'Token',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      refreshToken: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      expireDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {}
  )
