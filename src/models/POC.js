const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const POC = sequelize.define('POC', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'pocs',
    timestamps: true,
  });

  // Associations
  POC.associate = (models) => {
    POC.belongsTo(models.Lead, { foreignKey: 'leadId' });
  };

  return POC;
};
