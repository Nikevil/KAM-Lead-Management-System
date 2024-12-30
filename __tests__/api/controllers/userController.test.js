const userRepository = require('../../../api/repositories/userRepository');
const roleRepository = require('../../../api/repositories/roleRepository');
const {
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../../../api/controllers/userController');

jest.mock('../../../api/repositories/userRepository');
jest.mock('../../../api/repositories/roleRepository');

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, user: { id: 1 }, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('addUser', () => {
    it('should return 400 if invalid roles are provided', async () => {
      req.body = { roles: [1, 2] };
      roleRepository.getAllRoles.mockResolvedValue([{ id: 1 }]);

      await addUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid roles provided' });
    });

    it('should create a user and assign roles successfully', async () => {
      // Mock request data
      req.body = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password',
        email: 'johndoe@example.com',
        phone: '1234567890',
        status: 'active',
        roles: [1, 2],
      };
      
      // Mock authenticated user from token
      req.user = { id: 42 };
      
      // Mock the created user object
      const mockUser = {
        id: 1,
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: req.user.id,
        updatedBy: req.user.id,
      };
      
      // Mock repository responses
      userRepository.validateUser.mockResolvedValue();
      roleRepository.getAllRoles.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      userRepository.createUser.mockResolvedValue(mockUser);
      userRepository.addUserRoles.mockResolvedValue();
      
      // Call the function
      await addUser(req, res, next);
      
      // Debugging: Log the response JSON mock calls to compare
      console.log('JSON Response:', res.json.mock.calls);
      
      // Assert the correct response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User added successfully',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          username: mockUser.username,
          email: mockUser.email,
          status: mockUser.status,
          phone: mockUser.phone,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
          createdBy: req.user.id,
          updatedBy: req.user.id,
        },
      });
    });
      

    it('should handle errors and call next with the error', async () => {
      const error = new Error('Database error');
      userRepository.validateUser.mockRejectedValue(error);

      await addUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, username: 'johndoe' }];
      userRepository.getAllUsers.mockResolvedValue(users);

      await getUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should handle errors and call next with the error', async () => {
      const error = new Error('Database error');
      userRepository.getAllUsers.mockRejectedValue(error);

      await getUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById', () => {
    it('should return 404 if user not found', async () => {
      req.params.id = 1;
      userRepository.findUserById.mockResolvedValue(null);

      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return the user if found', async () => {
      req.params.id = 1;
      const user = { id: 1, username: 'johndoe' };
      userRepository.findUserById.mockResolvedValue(user);

      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should handle errors and call next with the error', async () => {
      const error = new Error('Database error');
      userRepository.findUserById.mockRejectedValue(error);

      await getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateUser', () => {
    it('should return 400 if invalid roles are provided', async () => {
      req.body = { roles: [1, 2] };
      roleRepository.getAllRoles.mockResolvedValue([{ id: 1 }]);

      await updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid roles provided' });
    });

    it('should update the user and assign roles successfully', async () => {
      req.body = {
        username: 'johndoe_updated',
        email: 'johndoe_updated@example.com',
        roles: [1, 2],
      };
      req.params.id = 1;
      const mockUser = { id: 1, username: 'johndoe_updated' };
      roleRepository.getAllRoles.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      userRepository.updateUser.mockResolvedValue(mockUser);
      userRepository.addUserRoles.mockResolvedValue();

      await updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: mockUser,
      });
    });

    it('should handle errors and call next with the error', async () => {
      const error = new Error('Database error');
      userRepository.updateUser.mockRejectedValue(error);

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteUser', () => {
    it('should return 404 if user not found', async () => {
      req.params.id = 1;
      userRepository.deleteUser.mockResolvedValue(null);

      await deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should delete the user successfully', async () => {
      // Mock request parameters
      req.params = { id: 1 };
      
      // Mock the repository function to resolve with a user object
      userRepository.deleteUser.mockResolvedValue({ id: 1, destroy: jest.fn() });
      
      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),  // Mock chainable status function
        json: jest.fn(),  // Mock json function
      };
      
      // Call the controller function
      await deleteUser(req, res, next);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(204);
    });
      

    it('should handle errors and call next with the error', async () => {
      const error = new Error('Database error');
      userRepository.deleteUser.mockRejectedValue(error);

      await deleteUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
