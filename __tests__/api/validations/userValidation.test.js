const {
  addUserValidationSchema,
  updateUserValidationSchema,
  userIdValidationSchema,
} = require('../../../api/validations/userValidation');

describe('Joi Validation Schemas for Users', () => {
  
  // Test addUserValidationSchema
  describe('addUserValidationSchema', () => {
    it('should validate correct data', () => {
      const validData = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        email: 'john.doe@example.com',
        phone: '1234567890',
        status: 'active',
        roles: [1, 2],
      };

      const { error } = addUserValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing name', () => {
      const invalidData = {
        username: 'johndoe',
        password: 'password123',
        phone: '1234567890',
      };

      const { error } = addUserValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"name" is required');
    });

    it('should return error for missing username', () => {
      const invalidData = {
        name: 'John Doe',
        password: 'password123',
        phone: '1234567890',
      };

      const { error } = addUserValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"username" is required');
    });

    it('should return error for invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        email: 'invalid-email',
        phone: '1234567890',
      };

      const { error } = addUserValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"email" must be a valid email');
    });

    it('should return error for invalid phone', () => {
      const invalidData = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        phone: '123',
      };

      const { error } = addUserValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"phone" length must be at least 10 characters long');
    });

    it('should pass when optional fields (email, status, roles) are missing', () => {
      const validData = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        phone: '1234567890',
      };

      const { error } = addUserValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });

  // Test updateUserValidationSchema
  describe('updateUserValidationSchema', () => {
    it('should validate correct data with optional fields', () => {
      const validData = {
        name: 'John Doe Updated',
        username: 'johndoe',
        phone: '1234567890',
        status: 'inactive',
        roles: [1],
      };

      const { error } = updateUserValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should pass when optional fields are missing', () => {
      const validData = {
        name: 'John Doe Updated',
        phone: '1234567890',
      };

      const { error } = updateUserValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for invalid status', () => {
      const invalidData = {
        name: 'John Doe Updated',
        phone: '1234567890',
        status: 'inactive-status',
      };

      const { error } = updateUserValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"status" must be one of [active, inactive]');
    });

    it('should return error for invalid phone', () => {
      const invalidData = {
        name: 'John Doe Updated',
        phone: '123',
      };

      const { error } = updateUserValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"phone" length must be at least 10 characters long');
    });
  });

  // Test userIdValidationSchema
  describe('userIdValidationSchema', () => {
    it('should validate correct user ID', () => {
      const validData = { id: 1 };
      const { error } = userIdValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing user ID', () => {
      const invalidData = {};
      const { error } = userIdValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"id" is required');
    });

    it('should return error for non-integer user ID', () => {
      const invalidData = { id: 'abc' };
      const { error } = userIdValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"id" must be a number');
    });
  });
});
