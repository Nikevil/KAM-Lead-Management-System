const { getRoles, getRoleById } = require('../../../api/controllers/roleController');
const roleRepository = require('../../../api/repositories/roleRepository');

jest.mock('../../../api/repositories/roleRepository'); // Mock the roleRepository

describe('Role Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  // Test case for getRoles
  describe('getRoles', () => {
    it('should return 200 and roles when getRoles is called with valid filters', async () => {
      const mockRoles = [
        { id: 1, roleName: 'Admin' },
        { id: 2, roleName: 'User' },
      ];
      req.query.filters = { roleName: 'Admin' }; // Mock filters

      roleRepository.getAllRoles.mockResolvedValue(mockRoles); // Mock the repository method

      await getRoles(req, res, next);

      expect(roleRepository.getAllRoles).toHaveBeenCalledWith({ roleName: 'Admin' }); // Check if getAllRoles is called with the correct filters
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRoles);
    });

    it('should return 500 if an error occurs in getRoles', async () => {
      const errorMessage = 'Database error';
      roleRepository.getAllRoles.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await getRoles(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });

  // Test case for getRoleById
  describe('getRoleById', () => {
    it('should return 200 and the role when getRoleById is called with a valid ID', async () => {
      const mockRole = { id: 1, roleName: 'Admin' };
      req.params.id = 1; // Mock the role ID in params

      roleRepository.findRoleById.mockResolvedValue(mockRole); // Mock the repository method

      await getRoleById(req, res, next);

      expect(roleRepository.findRoleById).toHaveBeenCalledWith(1); // Check if findRoleById is called with the correct ID
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRole);
    });

    it('should return 404 if role not found during getRoleById', async () => {
      req.params.id = 1; // Mock the role ID in params

      roleRepository.findRoleById.mockResolvedValue(null); // Mock role not found

      await getRoleById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Role not found' });
    });

    it('should return 500 if an error occurs in getRoleById', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the role ID in params

      roleRepository.findRoleById.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await getRoleById(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
});
