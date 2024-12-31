const userRepository = require('../../../api/repositories/userRepository');
const db = require('../../../api/models'); // Sequelize models

// Mock the required models
jest.mock('../../../api/models'); // Mock db.User, db.Role, etc.

describe('UserRepository', () => {
  beforeEach(() => {
    db.User.create.mockReset();
    db.User.findAll.mockReset();
    db.User.findOne.mockReset();
    db.User.findByPk.mockReset();
    db.User.update.mockReset();
    db.UserRole.bulkCreate.mockReset();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const mockUser = { id: 1, name: 'John Doe', username: 'john_doe', email: 'john@example.com' };
      db.User.create.mockResolvedValue(mockUser);

      const result = await userRepository.createUser({
        name: 'John Doe',
        username: 'john_doe',
        password: 'password',
        email: 'john@example.com',
        phone: '123456789',
      }, 1);

      expect(db.User.create).toHaveBeenCalledWith({
        name: 'John Doe',
        username: 'john_doe',
        password: 'password',
        email: 'john@example.com',
        status: 'active',
        phone: '123456789',
        createdBy: 1,
        updatedBy: 1,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with their roles', async () => {
      const mockUsers = [
        { id: 1, username: 'john_doe', email: 'john@example.com' },
        { id: 2, username: 'jane_doe', email: 'jane@example.com' },
      ];
      db.User.findAll.mockResolvedValue(mockUsers);

      const result = await userRepository.getAllUsers();

      expect(db.User.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'username', 'email', 'status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
        include: [{
          model: db.Role,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        }],
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('validateUser', () => {
    it('should throw an error if user already exists', async () => {
      db.User.findOne.mockResolvedValue({}); // Mock that a user exists

      await expect(userRepository.validateUser({ username: 'john_doe' }))
        .rejects
        .toThrow('User already exists');
    });

    it('should not throw an error if user does not exist', async () => {
      db.User.findOne.mockResolvedValue(null); // Mock that no user exists

      await expect(userRepository.validateUser({ username: 'john_doe' }))
        .resolves
        .not
        .toThrow();
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID with their roles', async () => {
      const mockUser = { id: 1, username: 'john_doe', email: 'john@example.com' };
      db.User.findByPk.mockResolvedValue(mockUser);

      const result = await userRepository.findUserById(1);

      expect(db.User.findByPk).toHaveBeenCalledWith(1, {
        attributes: ['id', 'username', 'email', 'status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
        include: [{
          model: db.Role,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        }],
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if the user is not found', async () => {
      db.User.findByPk.mockResolvedValue(null);

      const result = await userRepository.findUserById(999);

      expect(db.User.findByPk).toHaveBeenCalledWith(999, {
        attributes: ['id', 'username', 'email', 'status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
        include: [{
          model: db.Role,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        }],
      });
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user and validate unique constraints', async () => {
      const mockUser = { id: 1, username: 'john_doe', email: 'john@example.com' };
      db.User.findByPk.mockResolvedValue(mockUser);
      db.User.update.mockResolvedValue([1]); // Mock successful update

      db.User.findOne.mockResolvedValue(null); // Mock that the user doesn't already exist with the given constraints

      const result = await userRepository.updateUser({
        username: 'john_doe_updated',
        email: 'john_updated@example.com',
        phone: '987654321',
        status: 'active',
      }, 1, 2);

      expect(db.User.update).toHaveBeenCalledWith({
        username: 'john_doe_updated',
        email: 'john_updated@example.com',
        phone: '987654321',
        status: 'active',
        updatedBy: 2,
      }, { where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if the user is not found', async () => {
      db.User.findByPk.mockResolvedValue(null);

      await expect(userRepository.updateUser({
        username: 'john_doe_updated',
        email: 'john_updated@example.com',
        phone: '987654321',
        status: 'active',
      }, 999, 2))
        .rejects
        .toThrow('User not found');
    });

    it('should throw error if validation fails for unique constraints', async () => {
      const mockUser = { id: 1, username: 'john_doe', email: 'john@example.com' };
      db.User.findByPk.mockResolvedValue(mockUser);

      db.User.findOne.mockResolvedValue(mockUser); // Mock that the user already exists with the given constraints

      await expect(userRepository.updateUser({
        username: 'john_doe_updated',
        email: 'john_updated@example.com',
        phone: '987654321',
        status: 'active',
      }, 1, 2))
        .rejects
        .toThrow('User already exists');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const mockUser = { id: 1, username: 'john_doe' };
      db.User.findByPk.mockResolvedValue(mockUser);
      mockUser.destroy = jest.fn().mockResolvedValue(true);

      const result = await userRepository.deleteUser(1);

      expect(db.User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return null if user is not found', async () => {
      db.User.findByPk.mockResolvedValue(null);

      const result = await userRepository.deleteUser(999);

      expect(db.User.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });

    it('should throw an error if deletion fails', async () => {
      const mockUser = { id: 1, username: 'john_doe' };
      db.User.findByPk.mockResolvedValue(mockUser);
      mockUser.destroy = jest.fn().mockRejectedValue(new Error('Error deleting user'));

      await expect(userRepository.deleteUser(1))
        .rejects
        .toThrow('Error deleting order: Error deleting user');
    });
  });
});
