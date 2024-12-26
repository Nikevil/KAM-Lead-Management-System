module.exports = (sequelize, DataTypes) => {
    const AssignmentHistory = sequelize.define('AssignmentHistory', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      previousUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      currentUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reassignedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'assignment_history',
      timestamps: false,
    });
  
    AssignmentHistory.associate = (models) => {
      AssignmentHistory.belongsTo(models.Lead, { foreignKey: 'leadId' });
      AssignmentHistory.belongsTo(models.User, { as: 'PreviousUser', foreignKey: 'previousUserId' });
      AssignmentHistory.belongsTo(models.User, { as: 'CurrentUser', foreignKey: 'currentUserId' });
    };
  
    return AssignmentHistory;
  };
  