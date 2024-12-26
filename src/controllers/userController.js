const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const { Op } = require('sequelize');

exports.addUser = async (req, res) => {
  const { username, password, email, status, roles } = req.body;
  try {
    // Validate if the user already exists
    await userRepository.validateUser(username);

    // Validate roles
    const validRoles = await roleRepository.getAll({
      id: {
        [Op.in]: roles,
      },
      status: 'active',
    });
    if (validRoles.length !== roles.length) {
      return res.status(400).json({ message: 'Invalid roles provided' });
    }

    // Create the user
    const user = await userRepository.createUser(username, password, email, status);

    // Map roles to the user by creating entries in UserRole
    const userRoles = roles.map(roleId => ({ userId: user.id, roleId }));
    await userRepository.addUserRoles(userRoles);

    res.status(201).json({ message: 'User added successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { username, roles } = req.body;
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user details
    if (username) user.username = username;

    // Validate and update roles
    if (roles) {
      const validRoles = await roleRepository.getAll({ id: roles });
      if (validRoles.length !== roles.length) {
        return res.status(400).json({ message: 'Invalid roles provided' });
      }
      await user.setRoles(validRoles);
    }

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};