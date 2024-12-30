const {
  createContactValidationSchema,
  updateContactValidationSchema,
  validateIdSchema,
  validateLeadIdSchema,
  validateLeadContactsSchema,
} = require('../../../api/validations/contactValidation');

describe('Joi Validation Schemas', () => {
  // Test createContactValidationSchema
  describe('createContactValidationSchema', () => {
    it('should validate correct data', () => {
      const validData = {
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        role: 'admin',
      };

      const { error } = createContactValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing name', () => {
      const invalidData = {
        phone: '1234567890',
        email: 'john@example.com',
        role: 'admin',
      };

      const { error } = createContactValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('name is required');
    });

    it('should return error for invalid phone number', () => {
      const invalidData = {
        name: 'John Doe',
        phone: '123',
        email: 'john@example.com',
        role: 'admin',
      };

      const { error } = createContactValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('phone must be at least 10 characters');
    });

    it('should return error for invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        phone: '1234567890',
        email: 'invalid-email',
        role: 'admin',
      };

      const { error } = createContactValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('email must be a valid email address');
    });
  });

  // Test updateContactValidationSchema
  describe('updateContactValidationSchema', () => {
    it('should validate correct data', () => {
      const validData = {
        name: 'John Doe Updated',
        phone: '0987654321',
        email: 'john_updated@example.com',
        role: 'user',
      };

      const { error } = updateContactValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should pass with optional fields missing', () => {
      const validData = {
        role: 'admin',
      };

      const { error } = updateContactValidationSchema.validate(validData);
      expect(error).toBeUndefined();
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

  // Test validateLeadContactsSchema
  describe('validateLeadContactsSchema', () => {
    it('should validate correct leadId and contacts array', () => {
      const validData = {
        leadId: 1,
        contacts: [
          {
            name: 'John Doe',
            phone: '1234567890',
            email: 'john@example.com',
            role: 'admin',
          },
        ],
      };

      const { error } = validateLeadContactsSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing leadId', () => {
      const invalidData = { contacts: [] };
      const { error } = validateLeadContactsSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('leadId is required');
    });

    it('should return error for invalid contacts array', () => {
      const invalidData = { leadId: 1, contacts: 'invalid contacts' };
      const { error } = validateLeadContactsSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('contacts must be an array');
    });

    it('should return error for invalid contact in contacts array', () => {
      const invalidData = {
        leadId: 1,
        contacts: [
          {
            name: 'John Doe',
            phone: '90292-1345',
            email: 'john@example.com',
            role: 'admin',
          },
        ],
      };
      const { error } = validateLeadContactsSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('phone must contain only digits');
    });
  });
});
