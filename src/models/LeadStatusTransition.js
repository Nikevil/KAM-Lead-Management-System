module.exports = (sequelize, DataTypes) => {
    const LeadStatusTransition = sequelize.define('LeadStatusTransition', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fromStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      toStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transitionedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      tableName: 'lead_status_transitions',
      timestamps: false,
    });
  
    LeadStatusTransition.associate = (models) => {
      LeadStatusTransition.belongsTo(models.Lead, { foreignKey: 'leadId' });
    };
  
    return LeadStatusTransition;
  };
  