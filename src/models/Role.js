module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'), // Use ENUM type for better validation
        defaultValue: 'active', // Default status is 'active'
      },
    },
    {
      tableName: 'roles', // Specify the actual table name
      timestamps: true, // Disable automatic timestamps (createdAt/updatedAt)
      indexes: [
        { fields: ['name'], unique: true },
        { fields: ['status'] },
      ],      
    }
  );

  // Associations
  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: models.UserRole,
      foreignKey: 'roleId',
      otherKey: 'userId',
    });
  };

  return Role;
};
