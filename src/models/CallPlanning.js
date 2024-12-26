module.exports = (sequelize, DataTypes) => {
  const CallPlanning = sequelize.define('CallPlanning', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    frequencyDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastCallDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextCallDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'call_planning',
    timestamps: true,
  });

  CallPlanning.associate = (models) => {
    CallPlanning.belongsTo(models.Lead, { foreignKey: 'leadId' });
  };

  return CallPlanning;
};
