const roleRepository = require('../repositories/roleRepository');


// Get all roles (GET)
exports.getRoles = async (req, res, next) => {
  const { filters } = req.query;
  try {
    const roles = await roleRepository.getAllRoles(filters);
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

// Get role by ID (GET)
exports.getRoleById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const role = await roleRepository.findRoleById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};
