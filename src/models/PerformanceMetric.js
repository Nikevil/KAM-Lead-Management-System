module.exports = (sequelize, DataTypes) => {
    const PerformanceMetric = sequelize.define('PerformanceMetric', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalOrders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalRevenue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      lastOrderDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
      tableName: 'performance_metrics',
      timestamps: true,
    });
  
    PerformanceMetric.associate = (models) => {
      PerformanceMetric.belongsTo(models.Lead, { foreignKey: 'leadId' });
    };
  
    return PerformanceMetric;
  };
  