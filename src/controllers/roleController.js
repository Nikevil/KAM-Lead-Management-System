const roleRepository = require('../repositories/roleRepository');

// Add a new role
exports.addRole = async (req, res, next) => {
  const { name, status } = req.body;
  try {
    // Create a new role
    const role = await roleRepository.createRole({ name, status });
    res.status(201).json({ message: 'Role added successfully', role });
  } catch (error) {
    next(error)
  }
};

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

// Update role by ID (PUT)
exports.updateRole = async (req, res, next) => {
  const { id } = req.params;
  const { name, status } = req.body;
  try {
    const updatedRole = await roleRepository.updateRole(id, { name, status });
    res.status(200).json(updatedRole);
  } catch (error) {
    next(error);
  }
};

// Delete role by ID (DELETE)
exports.deleteRole = async (req, res, next) => {
  const { id } = req.params;
  try {
    await roleRepository.delete(id);
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    next(error);
  }
};
