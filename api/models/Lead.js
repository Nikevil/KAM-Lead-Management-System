const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lead = sequelize.define(
    'Lead',
    {
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
        type: DataTypes.ENUM(
          'New',
          'In Progress',
          'Follow Up',
          'Closed',
          'Won',
          'Lost',
        ),
        defaultValue: 'New',
      },
      callFrequency: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 7,
      },
      lastCallDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nextCallDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: 'leads',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['restaurantName', 'location'],
        },
        {
          fields: ['userId'],
        },
      ],
    },
  );

  // Associations
  Lead.associate = (models) => {
    Lead.belongsTo(models.User, { foreignKey: 'userId', allowNull: false });
    Lead.hasMany(models.LeadContacts, { foreignKey: 'leadId' });
    Lead.hasMany(models.Interaction, { foreignKey: 'leadId' });
    Lead.hasMany(models.Order, { foreignKey: 'leadId' });
  };

  return Lead;
};
