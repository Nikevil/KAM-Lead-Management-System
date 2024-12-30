const {
  createInteractionValidationSchema,
  updateInteractionValidationSchema,
  validateIdSchema,
  validateLeadIdSchema,
} = require('../../../api/validations/interactionValidation');
  
describe('Joi Validation Schemas for Interactions', () => {
    
  // Test createInteractionValidationSchema
  describe('createInteractionValidationSchema', () => {
    it('should validate correct data', () => {
      const validData = {
        leadId: 1,
        contactId: 2,
        interactionType: 'call',
        interactionDate: '2024-01-01',
        duration: 30,
        outcome: 'successful',
        notes: 'Initial interaction',
        orderId: 123,
      };
  
      const { error } = createInteractionValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  
    it('should return error for missing leadId', () => {
      const invalidData = {
        contactId: 2,
        interactionType: 'call',
        interactionDate: '2024-01-01',
      };
  
      const { error } = createInteractionValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('leadId is required');
    });
  
    it('should return error for invalid interactionType', () => {
      const invalidData = {
        leadId: 1,
        interactionType: 'text',
        interactionDate: '2024-01-01',
      };
  
      const { error } = createInteractionValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('interactionType must be one of \'call\', \'email\', \'meeting\', or \'other\'');
    });
  
    it('should return error for invalid contactId', () => {
      const invalidData = {
        leadId: 1,
        contactId: 'abc',
        interactionType: 'call',
        interactionDate: '2024-01-01',
      };
  
      const { error } = createInteractionValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('contactId must be a number');
    });
  
    it('should return error for invalid date format in interactionDate', () => {
      const invalidData = {
        leadId: 1,
        interactionType: 'call',
        interactionDate: 'invalid-date',
      };
  
      const { error } = createInteractionValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('interactionDate must be a valid date');
    });
  
    it('should pass when optional fields (like notes, orderId) are missing', () => {
      const validData = {
        leadId: 1,
        contactId: 2,
        interactionType: 'call',
      };
  
      const { error } = createInteractionValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });
  
  // Test updateInteractionValidationSchema
  describe('updateInteractionValidationSchema', () => {
    it('should validate correct data', () => {
      const validData = {
        leadId: 1,
        contactId: 2,
        interactionType: 'email',
        interactionDate: '2024-01-01',
        duration: 20,
        outcome: 'successful',
        notes: 'Follow-up',
        orderId: 456,
      };
  
      const { error } = updateInteractionValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  
    it('should pass with optional fields missing', () => {
      const validData = {
        leadId: 1,
        interactionType: 'meeting',
      };
  
      const { error } = updateInteractionValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  
    it('should return error for invalid interactionType', () => {
      const invalidData = {
        leadId: 1,
        interactionType: 'video-call',
      };
  
      const { error } = updateInteractionValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"interactionType" must be one of [call, email, meeting, other]');
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
      expect(error.details[0].message).toBe('ID is required');
    });
  
    it('should return error for non-integer ID', () => {
      const invalidData = { id: 'abc' };
      const { error } = validateIdSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('ID must be a number');
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
  