const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { login } = require('../../../api/controllers/authController');
const userRepository = require('../../../api/repositories/userRepository');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../api/repositories/userRepository');

describe('login', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 401 if the user does not exist', async () => {
    req.body = { username: 'nonexistent', password: 'password' };
    userRepository.findUserByUsername.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User must have at least one role' });
  });

  it('should return 401 if the user exists but has no roles', async () => {
    req.body = { username: 'userWithoutRoles', password: 'password' };
    userRepository.findUserByUsername.mockResolvedValue({ Roles: [] });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User must have at least one role' });
  });

  it('should return 401 if the password is incorrect', async () => {
    req.body = { username: 'validUser', password: 'wrongPassword' };
    userRepository.findUserByUsername.mockResolvedValue({
      password: 'hashedPassword',
      Roles: [{ name: 'user' }],
    });
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized Password is incorrect' });
  });

  it('should return 200 and a token if the password is correct', async () => {
    req.body = { username: 'validUser', password: 'correctPassword' };
    const mockToken = 'mockToken';
    const mockUser = {
      id: 1,
      password: 'hashedPassword',
      Roles: [{ name: 'user' }],
    };
    userRepository.findUserByUsername.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue(mockToken);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, role: mockUser.Roles[0].name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
  });

  it('should return 500 if an unexpected error occurs', async () => {
    req.body = { username: 'errorUser', password: 'password' };
    userRepository.findUserByUsername.mockRejectedValue(new Error('Database error'));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
  });
});