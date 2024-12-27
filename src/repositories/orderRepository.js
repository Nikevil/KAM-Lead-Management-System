const { Op } = require("sequelize");
const db = require("../models");

class OrderRepository {
  // Create a new order
  async createOrder(leadData) {
    try {
      const newOrder = await db.Order.create(leadData);
      return newOrder;
    } catch (error) {
      throw new Error("Error creating order: " + error.message);
    }
  }

  // Get a specific order by its ID
  async getOrderById(id) {
    try {
      const order = await db.Order.findByPk(id, {
        include: ["lead"], // You can include related models if needed
      });
      return order;
    } catch (error) {
      throw new Error("Error fetching order: " + error.message);
    }
  }

  // Get all orders for a specific lead
  async getOrdersByLeadId(leadId) {
    try {
      const orders = await db.Order.findAll({
        where: { leadId },
        include: ["lead"], // You can include related models if needed
      });
      return orders;
    } catch (error) {
      throw new Error("Error fetching orders by lead ID: " + error.message);
    }
  }

  // Update an order by its ID
  async updateOrder(id, orderData) {
    try {
      const order = await db.Order.findByPk(id);
      if (!order) {
        throw new Error("Order not found");
      }

      // Update the order details
      await order.update(orderData);
      return order;
    } catch (error) {
      throw new Error("Error updating order: " + error.message);
    }
  }

  // Delete an order by its ID
  async deleteOrder(id) {
    try {
      const order = await db.Order.findByPk(id);
      if (!order) {
        return null;
      }
      await order.destroy(); // Delete the order from the database
      return order;
    } catch (error) {
      throw new Error("Error deleting order: " + error.message);
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
        include: ["lead"], // You can include related models if needed
      });
      return orders;
    } catch (error) {
      throw new Error("Error fetching filtered orders: " + error.message);
    }
  }
}

module.exports = new OrderRepository();
