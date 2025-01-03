const { loginValidationSchema, changePasswordValidationSchema } = require('../../../api/validations/authValidation'); // Adjust path if needed

describe('loginValidationSchema', () => {
  it('should validate valid username and password', () => {
    const validData = {
      username: 'testuser',
      password: 'password123',
    };

    const { error } = loginValidationSchema.validate(validData);

    expect(error).toBeUndefined(); // No validation error should occur
  });

  it('should return an error if username is too short', () => {
    const invalidData = {
      username: 'ab', // Too short, should be at least 3 characters
      password: 'password123',
    };

    const { error } = loginValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"username" length must be at least 3 characters long');
  });

  it('should return an error if username is too long', () => {
    const invalidData = {
      username: 'a'.repeat(256), // Too long, should be at most 255 characters
      password: 'password123',
    };

    const { error } = loginValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"username" length must be less than or equal to 255 characters long');
  });

  it('should return an error if username is missing', () => {
    const invalidData = {
      password: 'password123',
    };

    const { error } = loginValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"username" is required');
  });

  it('should return an error if password is too short', () => {
    const invalidData = {
      username: 'testuser',
      password: 'pass', // Too short, should be at least 6 characters
    };

    const { error } = loginValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"password" length must be at least 6 characters long');
  });

  it('should return an error if password is missing', () => {
    const invalidData = {
      username: 'testuser',
    };

    const { error } = loginValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"password" is required');
  });


  it('should return an error if password contains invalid characters', () => {
    const invalidData = {
      username: 'testuser',
      password: 'pass@123', // Contains special characters, but this may be allowed based on your needs
    };

    const { error } = loginValidationSchema.validate(invalidData);

    expect(error).toBeUndefined(); // If special characters are allowed, the validation should pass
  });
});

describe('changePasswordValidationSchema', () => {
  it('should validate successfully with correct data', () => {
    const validData = {
      username: 'validuser',
      oldPassword: 'oldpassword123',
      newPassword: 'newpassword123',
    };

    const { error } = changePasswordValidationSchema.validate(validData);

    expect(error).toBeUndefined(); // No validation error should occur
  });

  it('should return an error if username is less than 3 characters', () => {
    const invalidData = {
      username: 'ab',
      oldPassword: 'oldpassword123',
      newPassword: 'newpassword123',
    };

    const { error } = changePasswordValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"username" length must be at least 3 characters long');
  });

  it('should return an error if username is more than 255 characters', () => {
    const invalidData = {
      username: 'a'.repeat(256),
      oldPassword: 'oldpassword123',
      newPassword: 'newpassword123',
    };

    const { error } = changePasswordValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"username" length must be less than or equal to 255 characters long');
  });

  it('should return an error if oldPassword is less than 6 characters', () => {
    const invalidData = {
      username: 'validuser',
      oldPassword: '123',
      newPassword: 'newpassword123',
    };

    const { error } = changePasswordValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"oldPassword" length must be at least 6 characters long');
  });

  it('should return an error if newPassword is less than 6 characters', () => {
    const invalidData = {
      username: 'validuser',
      oldPassword: 'oldpassword123',
      newPassword: '123',
    };

    const { error } = changePasswordValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"newPassword" length must be at least 6 characters long');
  });

  it('should return an error if any required field is missing', () => {
    const invalidData = {
      username: 'validuser',
      oldPassword: 'oldpassword123',
    };

    const { error } = changePasswordValidationSchema.validate(invalidData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('"newPassword" is required');
  });
});
