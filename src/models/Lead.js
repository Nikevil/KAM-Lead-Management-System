const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lead = sequelize.define('Lead', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cuisineType: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leadSource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leadStatus: {
      type: DataTypes.ENUM('New', 'In Progress', 'Follow Up', 'Closed', 'Won', 'Lost'),
      defaultValue: 'New',
    },
  }, {
    tableName: 'leads',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['restaurantName', 'location'], // Composite unique constraint
      },
    ],
  });

  // Associations
  Lead.associate = (models) => {
    Lead.hasMany(models.LeadContacts, { foreignKey: 'leadId' });
    Lead.hasMany(models.Interaction, { foreignKey: 'leadId' });
  };

  return Lead;
};
