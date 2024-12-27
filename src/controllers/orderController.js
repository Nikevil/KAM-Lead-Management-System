const orderRepository = require("../repositories/orderRepository");

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const {
      leadId,
      amount,
      productCategories,
      orderDate,
      status,
      notes,
      orderDetails,
    } = req.body;
    const userId = req.user.id;

    const newOrder = await orderRepository.createOrder({
      leadId,
      userId,
      orderDetails,
      productCategories,
      orderDate,
      status,
      notes,
      amount,
    });

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for a specific lead
exports.getOrdersByLeadId = async (req, res, next) => {
  try {
    const { leadId } = req.params;

    // Fetch orders associated with the lead
    const orders = await orderRepository.getOrdersByLeadId(leadId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        error: "No orders found for this lead.",
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Get a specific order by its ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch order by ID
    const order = await orderRepository.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Get orders with specific filters (for trends, performance analysis, etc.)
exports.getFilteredOrders = async (req, res, next) => {
  try {
    const { startDate, endDate, productCategory } = req.query;

    // Get orders based on filtering criteria like date range and product category
    const filteredOrders = await orderRepository.getFilteredOrders({
      startDate,
      endDate,
      productCategory,
    });

    if (!filteredOrders || filteredOrders.length === 0) {
      return res.status(404).json({
        error: "No orders found matching the criteria.",
      });
    }

    res.status(200).json(filteredOrders);
  } catch (error) {
    next(error);
  }
};

// Update an order by its ID
exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderData = req.body;

    // Update the order using the repository
    const updatedOrder = await orderRepository.updateOrder(id, orderData);

    if (!updatedOrder) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an order by its ID
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete the order using the repository
    const deletedOrder = await orderRepository.deleteOrder(id);

    if (!deletedOrder) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    res.status(200).json({
      message: "Order deleted successfully",
      order: deletedOrder,
    });
  } catch (error) {
    next(error);
  }
};
