module.exports = (seq, { DataTypes, UUIDV4 }) =>
  seq.define(
    'Message',
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
      roomId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {}
  )
