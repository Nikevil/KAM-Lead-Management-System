const { Op } = require('sequelize');
const db = require('../models');

class OrderRepository {
  // Create a new order
  async createOrder(orderData, userId) {
    try {
      const newOrder = await db.Order.create({
        ...orderData,
        createdBy: userId,
        updatedBy: userId,
      });
      return newOrder;
    } catch (error) {
      throw new Error('Error creating order: ' + error.message);
    }
  }

  // Get a specific order by its ID
  async getOrderById(id) {
    try {
      const order = await db.Order.findByPk(id, {
        include: ['lead'],
      });
      return order;
    } catch (error) {
      throw new Error('Error fetching order: ' + error.message);
    }
  }

  // Get all orders for a specific lead
  async getOrdersByLeadId(leadId) {
    try {
      const orders = await db.Order.findAll({
        where: { leadId },
        include: ['lead'],
      });
      return orders;
    } catch (error) {
      throw new Error('Error fetching orders by lead ID: ' + error.message);
    }
  }

  // Update an order by its ID
  async updateOrder(id, orderData, userId) {
    try {
      const order = await db.Order.findByPk(id);
      if (!order) {
        throw new Error('Order not found');
      }

      // Update the order details
      return await order.update({ ...orderData, updatedBy: userId });
    } catch (error) {
      throw new Error('Error updating order: ' + error.message);
    }
  }

  // Delete an order by its ID
  async deleteOrder(id) {
    try {
      const order = await db.Order.findByPk(id);
      if (!order) {
        return null;
      }
      return await order.destroy(); // Delete the order from the database
    } catch (error) {
      throw new Error('Error deleting order: ' + error.message);
    }
  }

  // Get orders with specific filters (e.g., by date range or product category)
  async getFilteredOrders({ startDate, endDate, productCategory }) {
    try {
      const whereClause = {};

      if (startDate && endDate) {
        whereClause.orderDate = {
          [Op.between]: [startDate, endDate],
        };
      }

      if (productCategory) {
        whereClause.productCategories = {
          [Op.contains]: [productCategory],
        };
      }

      const orders = await db.Order.findAll({
        where: whereClause,
        include: ['lead'],
      });
      return orders;
    } catch (error) {
      throw new Error('Error fetching filtered orders: ' + error.message);
    }
  }

  async getOrderingPatterns({ leadId, startDate, endDate, limit, offset }) {
    try {
      const whereClause = {
        orderDate: {
          [Op.between]: [
            startDate
              ? new Date(startDate)
              : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            endDate ? new Date(endDate) : new Date(),
          ],
        },
        status: 'completed',
      };

      if (leadId) {
        whereClause.leadId = leadId;
      }

      // Query to calculate ordering patterns
      const patterns = await db.Order.findAll({
        attributes: [
          'leadId',
          [
            db.Sequelize.fn('unnest', db.Sequelize.col('productCategories')),
            'category',
          ],
          [
            db.Sequelize.fn('COUNT', db.Sequelize.col('Order.id')),
            'totalOrders',
          ],
          [
            db.Sequelize.fn('SUM', db.Sequelize.col('amount')),
            'totalAmountSpent',
          ],
          [
            db.Sequelize.fn(
              'AVG',
              db.Sequelize.literal('DATE_PART(\'day\', NOW() - "orderDate")'),
            ),
            'averageDaysBetweenOrders',
          ],
        ],
        where: whereClause,
        group: [
          'leadId',
          'category',
          'lead.id',
          'lead.restaurantName',
          'lead.location',
        ],
        include: [
          {
            model: db.Lead,
            as: 'lead',
            attributes: ['id', 'restaurantName', 'location'],
          },
        ],
        limit,
        offset,
        raw: true,
      });

      return patterns.map((result) => ({
        leadId: result.leadId,
        restaurantName: result['lead.restaurantName'],
        location: result['lead.location'],
        category: result.category,
        totalOrders: parseInt(result.totalOrders, 10),
        totalAmountSpent: parseFloat(result.totalAmountSpent).toFixed(2),
        averageDaysBetweenOrders: parseFloat(
          result.averageDaysBetweenOrders,
        ).toFixed(2),
      }));
    } catch (error) {
      throw new Error('Error fetching ordering patterns: ' + error.message);
    }
  }
}

module.exports = new OrderRepository();
