const { Op } = require('sequelize');
const orderRepository = require('../../../api/repositories/orderRepository');
const db = require('../../../api/models');

// Mock the required models and Sequelize functions
jest.mock('../../../api/models', () => ({
  Order: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Lead: {},
  Sequelize: {
    fn: jest.fn(),
    col: jest.fn(),
    literal: jest.fn(),
  },
}));

describe('OrderRepository', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    const mockOrderData = {
      leadId: 1,
      amount: 100,
      productCategories: ['food', 'beverages'],
    };
    const mockUserId = 123;

    it('should successfully create an order', async () => {
      const mockCreatedOrder = { id: 1, ...mockOrderData };
      db.Order.create.mockResolvedValue(mockCreatedOrder);

      const result = await orderRepository.createOrder(mockOrderData, mockUserId);

      expect(db.Order.create).toHaveBeenCalledWith({
        ...mockOrderData,
        createdBy: mockUserId,
        updatedBy: mockUserId,
      });
      expect(result).toEqual(mockCreatedOrder);
    });

    it('should throw an error when creation fails', async () => {
      const error = new Error('Database error');
      db.Order.create.mockRejectedValue(error);

      await expect(orderRepository.createOrder(mockOrderData, mockUserId))
        .rejects
        .toThrow('Error creating order: Database error');
    });
  });

  describe('getOrderById', () => {
    const mockOrderId = 1;

    it('should successfully fetch an order by ID', async () => {
      const mockOrder = { id: mockOrderId, leadId: 1 };
      db.Order.findByPk.mockResolvedValue(mockOrder);

      const result = await orderRepository.getOrderById(mockOrderId);

      expect(db.Order.findByPk).toHaveBeenCalledWith(mockOrderId, {
        include: ['lead'],
      });
      expect(result).toEqual(mockOrder);
    });

    it('should return null when order is not found', async () => {
      db.Order.findByPk.mockResolvedValue(null);

      const result = await orderRepository.getOrderById(mockOrderId);

      expect(result).toBeNull();
    });

    it('should throw an error when fetch fails', async () => {
      db.Order.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(orderRepository.getOrderById(mockOrderId))
        .rejects
        .toThrow('Error fetching order: Database error');
    });
  });

  describe('getOrdersByLeadId', () => {
    const mockLeadId = 1;

    it('should successfully fetch orders by lead ID', async () => {
      const mockOrders = [
        { id: 1, leadId: mockLeadId },
        { id: 2, leadId: mockLeadId },
      ];
      db.Order.findAll.mockResolvedValue(mockOrders);

      const result = await orderRepository.getOrdersByLeadId(mockLeadId);

      expect(db.Order.findAll).toHaveBeenCalledWith({
        where: { leadId: mockLeadId },
        include: ['lead'],
      });
      expect(result).toEqual(mockOrders);
    });

    it('should throw an error when fetch fails', async () => {
      db.Order.findAll.mockRejectedValue(new Error('Database error'));

      await expect(orderRepository.getOrdersByLeadId(mockLeadId))
        .rejects
        .toThrow('Error fetching orders by lead ID: Database error');
    });
  });

  describe('updateOrder', () => {
    const mockOrderId = 1;
    const mockUserId = 123;
    const mockUpdateData = { amount: 200 };

    it('should successfully update an order', async () => {
      const mockOrder = {
        id: mockOrderId,
        update: jest.fn().mockResolvedValue({ id: mockOrderId, ...mockUpdateData }),
      };
      db.Order.findByPk.mockResolvedValue(mockOrder);

      const result = await orderRepository.updateOrder(mockOrderId, mockUpdateData, mockUserId);

      expect(db.Order.findByPk).toHaveBeenCalledWith(mockOrderId);
      expect(mockOrder.update).toHaveBeenCalledWith({
        ...mockUpdateData,
        updatedBy: mockUserId,
      });
      expect(result).toEqual({ id: mockOrderId, ...mockUpdateData });
    });

    it('should throw an error when order is not found', async () => {
      db.Order.findByPk.mockResolvedValue(null);

      await expect(orderRepository.updateOrder(mockOrderId, mockUpdateData, mockUserId))
        .rejects
        .toThrow('Order not found');
    });

    it('should throw an error when update fails', async () => {
      const mockOrder = {
        id: mockOrderId,
        update: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      db.Order.findByPk.mockResolvedValue(mockOrder);

      await expect(orderRepository.updateOrder(mockOrderId, mockUpdateData, mockUserId))
        .rejects
        .toThrow('Error updating order: Database error');
    });
  });

  describe('deleteOrder', () => {
    const mockOrderId = 1;

    it('should successfully delete an order', async () => {
      const mockOrder = {
        id: mockOrderId,
        destroy: jest.fn().mockResolvedValue(true),
      };
      db.Order.findByPk.mockResolvedValue(mockOrder);

      const result = await orderRepository.deleteOrder(mockOrderId);

      expect(db.Order.findByPk).toHaveBeenCalledWith(mockOrderId);
      expect(mockOrder.destroy).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should return null when order is not found', async () => {
      db.Order.findByPk.mockResolvedValue(null);

      const result = await orderRepository.deleteOrder(mockOrderId);

      expect(result).toBeNull();
    });

    it('should throw an error when deletion fails', async () => {
      const mockOrder = {
        id: mockOrderId,
        destroy: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      db.Order.findByPk.mockResolvedValue(mockOrder);

      await expect(orderRepository.deleteOrder(mockOrderId))
        .rejects
        .toThrow('Error deleting order: Database error');
    });
  });

  describe('getFilteredOrders', () => {
    it('should fetch orders with date range and product category', async () => {
      const mockFilters = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        productCategory: 'food',
      };
      const mockOrders = [{ id: 1 }, { id: 2 }];
      db.Order.findAll.mockResolvedValue(mockOrders);

      const result = await orderRepository.getFilteredOrders(mockFilters);

      expect(db.Order.findAll).toHaveBeenCalledWith({
        where: {
          orderDate: {
            [Op.between]: [mockFilters.startDate, mockFilters.endDate],
          },
          productCategories: {
            [Op.contains]: [mockFilters.productCategory],
          },
        },
        include: ['lead'],
      });
      expect(result).toEqual(mockOrders);
    });

    it('should fetch orders with only start date', async () => {
      const mockFilters = {
        startDate: '2024-01-01',
      };
      const mockOrders = [{ id: 1 }];
      db.Order.findAll.mockResolvedValue(mockOrders);

      const result = await orderRepository.getFilteredOrders(mockFilters);

      expect(db.Order.findAll).toHaveBeenCalledWith({
        where: {
          orderDate: {
            [Op.gte]: mockFilters.startDate,
          },
        },
        include: ['lead'],
      });
      expect(result).toEqual(mockOrders);
    });

    it('should throw an error when filter fetch fails', async () => {
      db.Order.findAll.mockRejectedValue(new Error('Database error'));

      await expect(orderRepository.getFilteredOrders({}))
        .rejects
        .toThrow('Error fetching filtered orders: Database error');
    });
  });

  describe('getOrderingPatterns', () => {
    const mockParams = {
      leadId: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      limit: 10,
      offset: 0,
    };

    it('should successfully fetch ordering patterns', async () => {
      const mockPatterns = [{
        leadId: 1,
        'lead.restaurantName': 'Test Restaurant',
        'lead.location': 'Test Location',
        category: 'food',
        totalOrders: '5',
        totalAmountSpent: '500.00',
        averageDaysBetweenOrders: '7.50',
      }];
      
      db.Order.findAll.mockResolvedValue(mockPatterns);
      db.Sequelize.fn.mockReturnValue('fn');
      db.Sequelize.col.mockReturnValue('col');
      db.Sequelize.literal.mockReturnValue('literal');

      const result = await orderRepository.getOrderingPatterns(mockParams);

      expect(db.Order.findAll).toHaveBeenCalled();
      expect(result).toEqual([{
        leadId: 1,
        restaurantName: 'Test Restaurant',
        location: 'Test Location',
        category: 'food',
        totalOrders: 5,
        totalAmountSpent: '500.00',
        averageDaysBetweenOrders: '7.50',
      }]);
    });

    it('should use default dates when not provided', async () => {
      const paramsWithoutDates = {
        leadId: 1,
        limit: 10,
        offset: 0,
      };
      
      const mockPatterns = [];
      db.Order.findAll.mockResolvedValue(mockPatterns);

      await orderRepository.getOrderingPatterns(paramsWithoutDates);

      expect(db.Order.findAll).toHaveBeenCalled();
      // Verify that the where clause includes default dates
      expect(db.Order.findAll.mock.calls[0][0].where.orderDate[Op.between][0]).toBeInstanceOf(Date);
      expect(db.Order.findAll.mock.calls[0][0].where.orderDate[Op.between][1]).toBeInstanceOf(Date);
    });

    it('should throw an error when pattern fetch fails', async () => {
      db.Order.findAll.mockRejectedValue(new Error('Database error'));

      await expect(orderRepository.getOrderingPatterns(mockParams))
        .rejects
        .toThrow('Error fetching ordering patterns: Database error');
    });
  });
});