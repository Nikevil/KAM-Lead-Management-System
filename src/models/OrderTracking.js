module.exports = (sequelize, DataTypes) => {
    const OrderTracking = sequelize.define('OrderTracking', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      orderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      orderDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      tableName: 'order_tracking',
      timestamps: true,
    });
  
    OrderTracking.associate = (models) => {
      OrderTracking.belongsTo(models.Lead, { foreignKey: 'leadId' });
    };
  
    return OrderTracking;
  };
  