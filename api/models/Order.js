const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'leads',
          key: 'id',
        },
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'completed',
      },
      productCategories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        comment: 'Categories of products purchased in the order',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional information about the order',
      },
      orderDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
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
      tableName: 'orders',
      timestamps: true,
      indexes: [
        { fields: ['leadId'] },
        { fields: ['orderDate'] },
        { fields: ['status'] },
      ],
    },
  );

  // Associations
  Order.associate = (models) => {
    Order.belongsTo(models.Lead, { foreignKey: 'leadId', as: 'lead' });
  };

  return Order;
};
