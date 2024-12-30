const authenticate = require('../../../api/middlewares/authenticate');
const jwt = require('jsonwebtoken');
const userRepository = require('../../../api/repositories/userRepository');
const logger = require('../../../api/utils/logger');

jest.mock('jsonwebtoken');
jest.mock('../../../api/repositories/userRepository');
jest.mock('../../../api/utils/logger');

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', async () => {
    // No token in the header
    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized, no token provided',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is invalid', async () => {
    // Provide an invalid token
    req.headers.authorization = 'Bearer invalidtoken';

    // Mock jwt.verify to throw an error
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
    });
    expect(logger.error).toHaveBeenCalledWith(new Error('Invalid token'));
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the user is not found after decoding the token', async () => {
    const decodedToken = { id: 1 };
    req.headers.authorization = 'Bearer validtoken';

    // Mock jwt.verify to return a decoded token
    jwt.verify.mockImplementation(() => decodedToken);

    // Mock userRepository.findUserById to return null (user not found)
    userRepository.findUserById.mockResolvedValue(null);

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized, user not found',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if the token is valid and the user is found', async () => {
    const decodedToken = { id: 1 };
    req.headers.authorization = 'Bearer validtoken';

    // Mock jwt.verify to return a decoded token
    jwt.verify.mockImplementation(() => decodedToken);

    // Mock userRepository.findUserById to return a user object
    const mockUser = { id: 1, name: 'Test User' };
    userRepository.findUserById.mockResolvedValue(mockUser);

    await authenticate(req, res, next);

    expect(req.user).toEqual(mockUser); // User should be attached to the req object
    expect(next).toHaveBeenCalled(); // Proceed to the next middleware
    expect(res.status).not.toHaveBeenCalled(); // No response should be sent
    expect(res.json).not.toHaveBeenCalled(); // No response should be sent
  });
});
