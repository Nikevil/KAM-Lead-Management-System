const {
  createOrderSchema,
  updateOrderSchema,
  getOrdersByLeadIdSchema,
  getOrderByIdSchema,
  getFilteredOrdersSchema,
  deleteOrderSchema,
  getOrderingPatternsSchema,
} = require('../../../api/validations/orderValidation');

describe('Joi Validation Schemas for Orders', () => {
  
  // Test createOrderSchema
  describe('createOrderSchema', () => {
    it('should validate correct data', () => {
      const validData = {
        leadId: 1,
        amount: 100,
        productCategories: ['electronics', 'furniture'],
        orderDate: '2024-12-31T00:00:00Z',
        status: 'pending',
        notes: 'Urgent delivery',
        orderDetails: [
          { productName: 'Laptop', quantity: 1, price: 999 },
          { productName: 'Sofa', quantity: 2, price: 250 },
        ],
      };

      const { error } = createOrderSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing leadId', () => {
      const invalidData = {
        amount: 100,
        productCategories: ['electronics'],
        orderDate: '2024-12-31T00:00:00Z',
        status: 'pending',
        orderDetails: [
          { productName: 'Laptop', quantity: 1, price: 999 },
        ],
      };

      const { error } = createOrderSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('leadId is required');
    });

    it('should return error for invalid amount', () => {
      const invalidData = {
        leadId: 1,
        amount: -10,
        productCategories: ['electronics'],
        orderDate: '2024-12-31T00:00:00Z',
        status: 'pending',
        orderDetails: [
          { productName: 'Laptop', quantity: 1, price: 999 },
        ],
      };

      const { error } = createOrderSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('amount must be greater than 0');
    });

    it('should return error for missing orderDetails', () => {
      const invalidData = {
        leadId: 1,
        amount: 100,
        productCategories: ['electronics'],
        orderDate: '2024-12-31T00:00:00Z',
        status: 'pending',
      };

      const { error } = createOrderSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('orderDetails is required');
    });

    it('should return error for invalid productCategories', () => {
      const invalidData = {
        leadId: 1,
        amount: 100,
        productCategories: ['electronics', 'invalidCategory'],
        orderDate: '2024-12-31T00:00:00Z',
        status: 'pending',
        orderDetails: [
          { productName: 'Laptop', quantity: 1, price: 999 },
        ],
      };

      const { error } = createOrderSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('productCategories must contain valid categories');
    });
  });

  // Test updateOrderSchema
  describe('updateOrderSchema', () => {
    it('should validate correct data with optional fields', () => {
      const validData = {
        amount: 150,
        status: 'completed',
        orderDetails: [
          { productName: 'Smartphone', quantity: 1, price: 499 },
        ],
      };

      const { error } = updateOrderSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should pass when optional fields (amount, orderDetails) are missing', () => {
      const validData = { leadId: 1 };

      const { error } = updateOrderSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for invalid status', () => {
      const invalidData = {
        status: 'shipped',
      };

      const { error } = updateOrderSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('status must be one of \'pending\', \'completed\', or \'cancelled\'');
    });
  });

  // Test getOrdersByLeadIdSchema
  describe('getOrdersByLeadIdSchema', () => {
    it('should validate correct leadId', () => {
      const validData = { leadId: 1 };

      const { error } = getOrdersByLeadIdSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing leadId', () => {
      const invalidData = {};

      const { error } = getOrdersByLeadIdSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"leadId" is required');
    });
  });

  // Test getOrderByIdSchema
  describe('getOrderByIdSchema', () => {
    it('should validate correct id', () => {
      const validData = { id: 1 };

      const { error } = getOrderByIdSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing id', () => {
      const invalidData = {};

      const { error } = getOrderByIdSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"id" is required');
    });
  });

  // Test getFilteredOrdersSchema
  describe('getFilteredOrdersSchema', () => {
    it('should validate valid filters', () => {
      const validData = { startDate: '2024-01-01', endDate: '2024-12-31', productCategory: 'electronics' };

      const { error } = getFilteredOrdersSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should pass when optional filters (startDate, endDate, productCategory) are missing', () => {
      const validData = {};

      const { error } = getFilteredOrdersSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });

  // Test deleteOrderSchema
  describe('deleteOrderSchema', () => {
    it('should validate correct id for deletion', () => {
      const validData = { id: 1 };

      const { error } = deleteOrderSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing id', () => {
      const invalidData = {};

      const { error } = deleteOrderSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"id" is required');
    });
  });

  // Test getOrderingPatternsSchema
  describe('getOrderingPatternsSchema', () => {
    it('should validate correct data with optional fields', () => {
      const validData = { leadId: 1, startDate: '2024-01-01', endDate: '2024-12-31', limit: 10, offset: 0 };

      const { error } = getOrderingPatternsSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should pass when optional fields (leadId, startDate, endDate, limit, offset) are missing', () => {
      const validData = {};

      const { error } = getOrderingPatternsSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });

});
