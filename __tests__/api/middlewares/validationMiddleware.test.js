const validationMiddleware = require('../../../api/middlewares/validationMiddleware'); // Path to your validationMiddleware
const Joi = require('joi'); // Assuming Joi is used for validation

describe('Validation Middleware', () => {
  let req, res, next;

  const mockNext = jest.fn(); // Mock next function
  beforeEach(() => {
    req = {}; // Initialize empty req object
    res = {
      status: jest.fn().mockReturnThis(), // Mock status function
      json: jest.fn(), // Mock json function
    };
  });

  it('should return a 400 error if validation fails for body', () => {
    // Define the validation schema for body
    const bodySchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().min(18).required(),
    });

    // Mock the request body with invalid data
    req.body = { name: '', age: 15 }; // Invalid body

    const schemas = {
      body: bodySchema,
    };

    validationMiddleware(schemas)(req, res, next);

    // Check if the response status is set to 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if the correct error message is returned for the invalid body
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid body: "name" is not allowed to be empty',
    });
  });

  it('should return a 400 error if validation fails for query parameters', () => {
    const querySchema = Joi.object({
      search: Joi.string().min(3).required(),
    });

    // Mock the request query with invalid data
    req.query = { search: 'ab' }; // Invalid query parameter

    const schemas = {
      query: querySchema,
    };

    validationMiddleware(schemas)(req, res, next);

    // Check if the response status is set to 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if the correct error message is returned for the invalid query
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid query: "search" length must be at least 3 characters long',
    });
  });

  it('should return a 400 error if validation fails for route parameters', () => {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().required(),
    });

    // Mock the request params with invalid data
    req.params = { id: 'abc' }; // Invalid param

    const schemas = {
      params: paramsSchema,
    };

    validationMiddleware(schemas)(req, res, next);

    // Check if the response status is set to 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if the correct error message is returned for the invalid params
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid params: "id" must be a number',
    });
  });

  it('should call next() if validation passes', () => {
    const bodySchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().min(18).required(),
    });

    // Mock valid request body
    req.body = { name: 'John', age: 25 };

    const schemas = {
      body: bodySchema,
    };

    validationMiddleware(schemas)(req, res, mockNext);

    // Check if next() is called, indicating that the validation passed
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return a 400 error if no schema is provided for a key', () => {
    const schemas = {};

    validationMiddleware(schemas)(req, res, mockNext);

    // Check that no response was sent for missing schema
    expect(res.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
