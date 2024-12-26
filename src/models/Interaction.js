const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Interaction = sequelize.define('Interaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    interactionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'interactions',
    timestamps: true,
  });

  // Associations
  Interaction.associate = (models) => {
    Interaction.belongsTo(models.Lead, { foreignKey: 'leadId' });
    Interaction.belongsTo(models.User, { foreignKey: 'userId' });
    Interaction.hasMany(models.InteractionLog, { foreignKey: 'interactionId' });
  };

  return Interaction;
};
