module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'), // ENUM for better validation
        defaultValue: 'active', // Default status is 'active'
      },
    },
    {
      tableName: 'user_roles',
      timestamps: false, // Set to true if you want Sequelize to manage timestamps
    }
  );

  // Associations
  UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    UserRole.belongsTo(models.Role, { foreignKey: 'roleId', onDelete: 'CASCADE' });
  };

  return UserRole;
};
