const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const { Op } = require('sequelize');

exports.addUser = async (req, res, next) => {
  try {
    const { name, username, password, email, phone, status, roles } = req.body;
    const userId = req.user.id;

    // Validate if the user already exists
    await userRepository.validateUser({ username });

    // Validate roles if provided
    if (roles && roles.length > 0) {
      const validRoles = await roleRepository.getAllRoles({
        id: {
          [Op.in]: roles,
        },
        status: 'active',
      });

      if (validRoles.length !== roles.length) {
        return res.status(400).json({ message: 'Invalid roles provided' });
      }
    }

    // Create the user
    const user = await userRepository.createUser(
      {
        name,
        username,
        password,
        email,
        status,
        phone,
      },
      userId,
    );

    // Map roles to the user by creating entries in UserRole
    const userRoles = roles.map((roleId) => ({
      userId: user.id,
      roleId,
      createdBy: userId,
      updatedBy: userId,
    }));

    if (roles && roles.length > 0) {
      await userRepository.addUserRoles(userRoles);
    }

    res.status(201).json({
      message: 'User added successfully',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        status: user.status,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        createdBy: user.createdBy,
        updatedBy: user.updatedBy,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userRepository.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { username, email, phone, roles, status } = req.body;
    const userId = req.user.id;

    // Validate roles if provided
    if (roles && roles.length > 0) {
      const validRoles = await roleRepository.getAllRoles({
        id: {
          [Op.in]: roles,
        },
        status: 'active',
      });
      if (validRoles.length !== roles.length) {
        return res.status(400).json({ message: 'Invalid roles provided' });
      }
    }

    const user = await userRepository.updateUser(
      { username, email, phone, status },
      req.params.id,
      userId,
    );

    // Map roles to the user by creating entries in UserRole if roles are provided
    if (roles && roles.length > 0) {
      const userRoles = roles.map((roleId) => ({
        userId: user.id,
        roleId,
        updatedBy: userId,
      }));
      await userRepository.addUserRoles(userRoles);
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userRepository.deleteUser(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
