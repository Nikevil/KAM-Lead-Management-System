const errorHandler = require('../../../api/middlewares/errorHandler');
const logger = require('../../../api/utils/logger');

jest.mock('../../../api/utils/logger'); // Mock the logger

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {}; // Default empty request object
    res = {
      status: jest.fn().mockReturnThis(), // Mock status function to chain
      json: jest.fn(), // Mock json function
    };
    next = jest.fn(); // Mock next function (not used here but included for completeness)
  });

  it('should log the error and return a 500 status by default', () => {
    const error = new Error('Something went wrong');
    error.status = 500; // Mocking the error status (optional, as it defaults to 500)

    errorHandler(error, req, res, next);

    // Check if the error message is logged
    expect(logger.error).toHaveBeenCalledWith('Something went wrong');
    
    // Check if the response status is set to 500
    expect(res.status).toHaveBeenCalledWith(500);
    
    // Check if the correct error message is returned in the response
    expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
  });

  it('should return the correct status code if provided in the error', () => {
    const error = new Error('Bad Request');
    error.status = 400; // Mocking a 400 Bad Request error

    errorHandler(error, req, res, next);

    // Check if the error message is logged
    expect(logger.error).toHaveBeenCalledWith('Bad Request');

    // Check if the response status is set to 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if the correct error message is returned in the response
    expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request' });
  });

  it('should return a 500 status and log the error if no status is provided', () => {
    const error = new Error('Internal Server Error');
    delete error.status; // Ensure the status is not set

    errorHandler(error, req, res, next);

    // Check if the error message is logged
    expect(logger.error).toHaveBeenCalledWith('Internal Server Error');

    // Check if the response status is set to 500 (default)
    expect(res.status).toHaveBeenCalledWith(500);

    // Check if the correct error message is returned in the response
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
