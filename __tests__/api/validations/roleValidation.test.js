const {
  getRolesValidationSchema,
  getRoleByIdValidationSchema,
} = require('../../../api/validations/roleValidation');

describe('Joi Validation Schemas for Roles', () => {

  // Test getRolesValidationSchema
  describe('getRolesValidationSchema', () => {
    it('should validate correct filters data', () => {
      const validData = { filters: 'active' };

      const { error } = getRolesValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should pass when filters is not provided (optional)', () => {
      const validData = {};

      const { error } = getRolesValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for invalid filters type', () => {
      const invalidData = { filters: 12345 };  // Filters should be a string

      const { error } = getRolesValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"filters" must be a string');
    });
  });

  // Test getRoleByIdValidationSchema
  describe('getRoleByIdValidationSchema', () => {
    it('should validate correct role ID', () => {
      const validData = { id: 1 };

      const { error } = getRoleByIdValidationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should return error for missing role ID', () => {
      const invalidData = {};

      const { error } = getRoleByIdValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"id" is required');
    });

    it('should return error for invalid role ID type', () => {
      const invalidData = { id: 'one' };  // ID should be a number

      const { error } = getRoleByIdValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"id" must be a number');
    });

    it('should return error for role ID being a float', () => {
      const invalidData = { id: 1.5 };  // ID should be an integer

      const { error } = getRoleByIdValidationSchema.validate(invalidData);
      expect(error).not.toBeUndefined();
      expect(error.details[0].message).toBe('"id" must be an integer');
    });
  });

});
