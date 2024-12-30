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
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'user_roles',
      timestamps: true,
      indexes: [
        { fields: ['userId', 'roleId'], unique: true },
        { fields: ['status'] },
      ],
    },
  );

  // Associations
  UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    UserRole.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE',
    });
  };

  return UserRole;
};
