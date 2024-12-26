const roleRepository = require('../repositories/roleRepository');

// Add a new role
exports.addRole = async (req, res) => {
  const { name, status } = req.body;
  try {
    // Create a new role
    const role = await roleRepository.create({ name, status });
    res.status(201).json({ message: 'Role added successfully', role });
  } catch (error) {
    // If role creation fails, catch the error and send a response
    res.status(500).json({ error: error.message });
  }
};

// Get all roles (GET)

exports.getAllRoles = async (req, res) => {
  const { filters } = req.query;
  try {
    const roles = await roleRepository.getAll(filters);
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get role by ID (GET)
exports.getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await roleRepository.getById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update role by ID (PUT)
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  try {
    const updatedRole = await roleRepository.update(id, { name, status });
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete role by ID (DELETE)
exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    await roleRepository.delete(id);
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
