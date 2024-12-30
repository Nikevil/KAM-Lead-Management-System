const {
  createOrder,
  getOrdersByLeadId,
  getOrderById,
  getFilteredOrders,
  updateOrder,
  deleteOrder,
  getOrderingPatterns,
} = require('../../../api/controllers/orderController');
const orderRepository = require('../../../api/repositories/orderRepository');
  
jest.mock('../../../api/repositories/orderRepository'); // Mock the orderRepository
  
describe('Order Controller', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });
  
  // Test case for createOrder
  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
      const mockOrder = { id: 1, product: 'Product A', quantity: 2 };
      req.body = { product: 'Product A', quantity: 2 };
  
      orderRepository.createOrder.mockResolvedValue(mockOrder); // Mock the repository method
  
      await createOrder(req, res, next);
  
      expect(orderRepository.createOrder).toHaveBeenCalledWith(
        { product: 'Product A', quantity: 2 },
        1,
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order created successfully',
        order: mockOrder,
      });
    });
  
    it('should return 500 if an error occurs in createOrder', async () => {
      const errorMessage = 'Database error';
      req.body = { product: 'Product A', quantity: 2 };
  
      orderRepository.createOrder.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method
  
      await createOrder(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
  
  // Test case for getOrdersByLeadId
  describe('getOrdersByLeadId', () => {
    it('should return 200 and orders for the lead', async () => {
      const mockOrders = [
        { id: 1, product: 'Product A', quantity: 2 },
        { id: 2, product: 'Product B', quantity: 1 },
      ];
      req.params.leadId = 1; // Mock the lead ID in params
  
      orderRepository.getOrdersByLeadId.mockResolvedValue(mockOrders); // Mock the repository method
  
      await getOrdersByLeadId(req, res, next);
  
      expect(orderRepository.getOrdersByLeadId).toHaveBeenCalledWith(1); // Check if getOrdersByLeadId is called with the correct lead ID
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrders);
    });
  
    it('should return 404 if no orders found for the lead', async () => {
      req.params.leadId = 1; // Mock the lead ID in params
  
      orderRepository.getOrdersByLeadId.mockResolvedValue([]); // Mock no orders found
  
      await getOrdersByLeadId(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No orders found for this lead.' });
    });
  
    it('should return 500 if an error occurs in getOrdersByLeadId', async () => {
      const errorMessage = 'Database error';
      req.params.leadId = 1; // Mock the lead ID in params
  
      orderRepository.getOrdersByLeadId.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method
  
      await getOrdersByLeadId(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
  
  // Test case for getOrderById
  describe('getOrderById', () => {
    it('should return 200 and the order when order is found', async () => {
      const mockOrder = { id: 1, product: 'Product A', quantity: 2 };
      req.params.id = 1; // Mock the order ID in params
  
      orderRepository.getOrderById.mockResolvedValue(mockOrder); // Mock the repository method
  
      await getOrderById(req, res, next);
  
      expect(orderRepository.getOrderById).toHaveBeenCalledWith(1); // Check if getOrderById is called with the correct ID
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });
  
    it('should return 404 if order not found', async () => {
      req.params.id = 1; // Mock the order ID in params
  
      orderRepository.getOrderById.mockResolvedValue(null); // Mock order not found
  
      await getOrderById(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order not found.' });
    });
  
    it('should return 500 if an error occurs in getOrderById', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the order ID in params
  
      orderRepository.getOrderById.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method
  
      await getOrderById(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
  
  // Test case for getFilteredOrders
  describe('getFilteredOrders', () => {
    it('should return 200 and filtered orders', async () => {
      const mockFilteredOrders = [
        { id: 1, product: 'Product A', quantity: 2 },
        { id: 2, product: 'Product B', quantity: 1 },
      ];
      req.query = { startDate: '2023-01-01', endDate: '2023-12-31', productCategory: 'Electronics' };
  
      orderRepository.getFilteredOrders.mockResolvedValue(mockFilteredOrders); // Mock the repository method
  
      await getFilteredOrders(req, res, next);
  
      expect(orderRepository.getFilteredOrders).toHaveBeenCalledWith({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        productCategory: 'Electronics',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFilteredOrders);
    });
  
    it('should return 404 if no orders found matching the criteria', async () => {
      req.query = { startDate: '2023-01-01', endDate: '2023-12-31', productCategory: 'Electronics' };
  
      orderRepository.getFilteredOrders.mockResolvedValue([]); // Mock no orders found
  
      await getFilteredOrders(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No orders found matching the criteria.' });
    });
  
    it('should return 500 if an error occurs in getFilteredOrders', async () => {
      const errorMessage = 'Database error';
      req.query = { startDate: '2023-01-01', endDate: '2023-12-31', productCategory: 'Electronics' };
  
      orderRepository.getFilteredOrders.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method
  
      await getFilteredOrders(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
  
  // Test case for updateOrder
  describe('updateOrder', () => {
    it('should update order successfully', async () => {
      const mockUpdatedOrder = { id: 1, product: 'Product A', quantity: 3 };
      req.params.id = 1; // Mock the order ID in params
      req.body = { product: 'Product A', quantity: 3 }; // Mock the updated order data
  
      orderRepository.updateOrder.mockResolvedValue(mockUpdatedOrder); // Mock the repository method
  
      await updateOrder(req, res, next);
  
      expect(orderRepository.updateOrder).toHaveBeenCalledWith(1, { product: 'Product A', quantity: 3 }, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order updated successfully',
        order: mockUpdatedOrder,
      });
    });
  
    it('should return 404 if order not found during update', async () => {
      req.params.id = 1; // Mock the order ID in params
      req.body = { product: 'Product A', quantity: 3 }; // Mock the updated order data
  
      orderRepository.updateOrder.mockResolvedValue(null); // Mock order not found
  
      await updateOrder(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order not found.' });
    });
  
    it('should return 500 if an error occurs in updateOrder', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the order ID in params
      req.body = { product: 'Product A', quantity: 3 }; // Mock the updated order data
  
      orderRepository.updateOrder.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method
  
      await updateOrder(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
  
  // Test case for deleteOrder
  describe('deleteOrder', () => {
    it('should delete order successfully', async () => {
      const mockDeletedOrder = { id: 1, product: 'Product A', quantity: 2 };
      req.params.id = 1; // Mock the order ID in params
  
      orderRepository.deleteOrder.mockResolvedValue(mockDeletedOrder); // Mock the repository method
  
      await deleteOrder(req, res, next);
  
      expect(orderRepository.deleteOrder).toHaveBeenCalledWith(1); // Check if deleteOrder is called with the correct order ID
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith();
    });
  
    it('should return 404 if order not found during delete', async () => {
      req.params.id = 1; // Mock the order ID in params
  
      orderRepository.deleteOrder.mockResolvedValue(null); // Mock order not found
  
      await deleteOrder(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order not found.' });
    });
  
    it('should return 500 if an error occurs in deleteOrder', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the order ID in params
  
      orderRepository.deleteOrder.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method
  
      await deleteOrder(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
  
  // Test case for getOrderingPatterns
  describe('getOrderingPatterns', () => {
    it('should return 200 and ordering patterns', async () => {
      const mockPatterns = [{
        leadId: 1,
        restaurantName: 'Test Restaurant',
        location: 'Test Location',
        category: 'Electronics',
        totalOrders: 5,
        totalAmountSpent: '100.00',
        averageDaysBetweenOrders: '10.00',
      }];
        
      // Set the query parameters, ensure 'limit' and 'offset' are passed as strings in req.query
      req.query = { leadId: 1, startDate: '2023-01-01', endDate: '2023-12-31', limit: 10, offset: 0 };
      
      // Mock the repository method to resolve with mock data
      orderRepository.getOrderingPatterns.mockResolvedValue(mockPatterns);
      
      // Call the controller method
      await getOrderingPatterns(req, res, next);
      
      // Check if the repository method was called with correct parameters
      expect(orderRepository.getOrderingPatterns).toHaveBeenCalledWith({
        leadId: 1, // Ensure 'leadId' is passed as a number
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        limit: 10,  // 'limit' should be parsed as an integer
        offset: 0,  // 'offset' should be parsed as an integer
      });
        
      // Verify the status and response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPatterns,
      });
    });
      
  
    it('should return 404 if no ordering patterns found', async () => {
      req.query = { leadId: 1, startDate: '2023-01-01', endDate: '2023-12-31' };
  
      orderRepository.getOrderingPatterns.mockResolvedValue([]); // Mock no patterns found
  
      await getOrderingPatterns(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No ordering patterns found.' });
    });
  
    it('should return 500 if an error occurs in getOrderingPatterns', async () => {
      const errorMessage = 'Database error';
      req.query = { leadId: 1, startDate: '2023-01-01', endDate: '2023-12-31' };
  
      orderRepository.getOrderingPatterns.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method
  
      await getOrderingPatterns(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
});
  