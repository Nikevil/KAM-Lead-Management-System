const roleRepository = require('../../../api/repositories/roleRepository');
const db = require('../../../api/models');

jest.mock('../../../api/models'); // Mock the db object

describe('RoleRepository', () => {
  beforeEach(() => {
    db.Role.findAll.mockReset();
    db.Role.findByPk.mockReset();
  });

  describe('getAllRoles', () => {
    it('should return all roles when no filters are provided', async () => {
      const mockRoles = [{ id: 1, name: 'Admin' }, { id: 2, name: 'User' }];
      db.Role.findAll.mockResolvedValue(mockRoles);

      const result = await roleRepository.getAllRoles();

      expect(db.Role.findAll).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual(mockRoles);
    });

    it('should return filtered roles based on provided filters', async () => {
      const filters = { name: 'Admin' };
      const mockRoles = [{ id: 1, name: 'Admin' }];
      db.Role.findAll.mockResolvedValue(mockRoles);

      const result = await roleRepository.getAllRoles(filters);

      expect(db.Role.findAll).toHaveBeenCalledWith({ where: filters });
      expect(result).toEqual(mockRoles);
    });
  });

  describe('findRoleById', () => {
    it('should return a role by its ID', async () => {
      const mockRole = { id: 1, name: 'Admin' };
      db.Role.findByPk.mockResolvedValue(mockRole);

      const result = await roleRepository.findRoleById(1);

      expect(db.Role.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRole);
    });

    it('should return null if the role is not found', async () => {
      db.Role.findByPk.mockResolvedValue(null);

      const result = await roleRepository.findRoleById(999);

      expect(db.Role.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
});
