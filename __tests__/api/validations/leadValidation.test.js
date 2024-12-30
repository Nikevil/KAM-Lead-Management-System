const {
  addLeadValidationSchema,
  updateLeadValidationSchema,
  updateCallFrequencyValidationSchema,
  recordCallValidationSchema,
  transferLeadsValidationSchema,
  getLeadPerformanceMetricsValidationSchema,
  validateIdSchema,
  validateLeadIdSchema,
} = require('../../../api/validations/leadValidation');

describe('Joi Validation Schemas for Leads', () => {
  
  // Test addLeadValidationSchema
  describe('addLeadValidationSchema', () => {
    it('should validate correct data', () => {
      const validData = {
        restaurantName: 'Pizza Palace',
        cuisineType: ['Italian', 'Mexican'],
        location: 'New York',
        leadSource: 'Referral',
        leadStatus: 'New',
        callFrequency: 5,
        kamId: 123,
      };

      const { error } = addLeadValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing restaurantName', () => {
      const invalidData = {
        cuisineType: ['Italian'],
        location: 'New York',
        leadSource: 'Referral',
        kamId: 123,
      };

      const { error } = addLeadValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Restaurant Name is required');
    });

    it('should return error for invalid cuisineType', () => {
      const invalidData = {
        restaurantName: 'Pizza Palace',
        cuisineType: ['Italian', 'French'],
        location: 'New York',
        leadSource: 'Referral',
        kamId: 123,
      };

      const { error } = addLeadValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"cuisineType[1]" must be one of [Italian, Indian, Chinese, Mexican]');
    });

    it('should return error for invalid leadSource', () => {
      const invalidData = {
        restaurantName: 'Pizza Palace',
        cuisineType: ['Italian'],
        location: 'New York',
        leadSource: 'Social Media',
        kamId: 123,
      };

      const { error } = addLeadValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Lead Source must be one of the following: Advertisement, Referral, Direct, Online');
    });

    it('should pass when optional fields (leadStatus, callFrequency) are missing', () => {
      const validData = {
        restaurantName: 'Pizza Palace',
        cuisineType: ['Italian'],
        location: 'New York',
        leadSource: 'Referral',
        kamId: 123,
      };

      const { error } = addLeadValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });

  // Test updateLeadValidationSchema
  describe('updateLeadValidationSchema', () => {
    it('should validate correct data with optional fields', () => {
      const validData = {
        restaurantName: 'Pizza Palace Updated',
        cuisineType: ['Indian', 'Mexican'],
        location: 'Los Angeles',
        leadSource: 'Direct',
        leadStatus: 'In Progress',
      };

      const { error } = updateLeadValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should pass when optional fields are missing', () => {
      const validData = {
        restaurantName: 'Pizza Palace Updated',
      };

      const { error } = updateLeadValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for invalid leadStatus', () => {
      const invalidData = {
        restaurantName: 'Pizza Palace Updated',
        leadStatus: 'Completed',
      };

      const { error } = updateLeadValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"leadStatus" must be one of [New, In Progress, Follow Up, Closed, Won, Lost]');
    });
  });

  // Test updateCallFrequencyValidationSchema
  describe('updateCallFrequencyValidationSchema', () => {
    it('should validate correct data', () => {
      const validData = { callFrequency: 10 };

      const { error } = updateCallFrequencyValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing callFrequency', () => {
      const invalidData = {};

      const { error } = updateCallFrequencyValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Call Frequency is required');
    });

    it('should return error for invalid callFrequency', () => {
      const invalidData = { callFrequency: 35 };

      const { error } = updateCallFrequencyValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Call Frequency should not exceed 30');
    });
  });

  // Test recordCallValidationSchema
  describe('recordCallValidationSchema', () => {
    it('should validate correct leadId', () => {
      const validData = { leadId: 1 };

      const { error } = recordCallValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing leadId', () => {
      const invalidData = {};

      const { error } = recordCallValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Lead ID is required');
    });

    it('should return error for invalid leadId', () => {
      const invalidData = { leadId: 'abc' };

      const { error } = recordCallValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Lead ID must be a number');
    });
  });

  // Test transferLeadsValidationSchema
  describe('transferLeadsValidationSchema', () => {
    it('should validate correct userIds', () => {
      const validData = { oldUserId: 1, newUserId: 2 };

      const { error } = transferLeadsValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing userIds', () => {
      const invalidData = {};

      const { error } = transferLeadsValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Old User ID is required');
    });

    it('should return error for invalid userIds', () => {
      const invalidData = { oldUserId: 'abc', newUserId: 'xyz' };

      const { error } = transferLeadsValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Old User ID must be a number');
    });
  });

  // Test getLeadPerformanceMetricsValidationSchema
  describe('getLeadPerformanceMetricsValidationSchema', () => {
    it('should validate correct leadId', () => {
      const validData = { id: 1 };

      const { error } = getLeadPerformanceMetricsValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing leadId', () => {
      const invalidData = {};

      const { error } = getLeadPerformanceMetricsValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Lead ID is required');
    });

    it('should return error for invalid leadId', () => {
      const invalidData = { id: 'abc' };

      const { error } = getLeadPerformanceMetricsValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('Lead ID must be a number');
    });
  });

  // Test validateIdSchema
  describe('validateIdSchema', () => {
    it('should validate correct ID', () => {
      const validData = { id: 1 };

      const { error } = validateIdSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing ID', () => {
      const invalidData = {};

      const { error } = validateIdSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('id is required');
    });

    it('should return error for non-integer ID', () => {
      const invalidData = { id: 'abc' };

      const { error } = validateIdSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('id must be a number');
    });
  });

  // Test validateLeadIdSchema
  describe('validateLeadIdSchema', () => {
    it('should validate correct leadId', () => {
      const validData = { leadId: 1 };

      const { error } = validateLeadIdSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing leadId', () => {
      const invalidData = {};

      const { error } = validateLeadIdSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('leadId is required');
    });

    it('should return error for non-integer leadId', () => {
      const invalidData = { leadId: 'abc' };

      const { error } = validateLeadIdSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('leadId must be a number');
    });
  });

});
