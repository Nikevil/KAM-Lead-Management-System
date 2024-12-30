const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Interaction = sequelize.define(
    'Interaction',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      interactionType: {
        type: DataTypes.ENUM('call', 'email', 'meeting', 'other'),
        allowNull: false,
      },
      interactionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      outcome: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id',
        },
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
      tableName: 'interactions',
      timestamps: true,
      indexes: [
        { fields: ['leadId'] },
        { fields: ['createdBy'] },
        { fields: ['contactId'] },
        { fields: ['interactionDate'] },
      ],
    },
  );

  // Associations
  Interaction.associate = (models) => {
    Interaction.belongsTo(models.Lead, { foreignKey: 'leadId' });
    Interaction.belongsTo(models.User, { foreignKey: 'createdBy' });
    Interaction.belongsTo(models.Contact, { foreignKey: 'contactId' });
    Interaction.belongsTo(models.Order, { foreignKey: 'orderId' });
  };

  return Interaction;
};
