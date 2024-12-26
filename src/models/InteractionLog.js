const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InteractionLog = sequelize.define('InteractionLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    interactionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    logType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    loggedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'interaction_logs',
    timestamps: false,
  });

  // Associations
  InteractionLog.associate = (models) => {
    InteractionLog.belongsTo(models.Interaction, { foreignKey: 'interactionId' });
    InteractionLog.belongsTo(models.Lead, { foreignKey: 'leadId' });
    InteractionLog.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return InteractionLog;
};
