const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // Fetch user along with their associated roles
    const user = await userRepository.findUserByUsername(username);

    if (!user || user.Roles.length === 0) {
      return res
        .status(401)
        .json({ message: 'User must have at least one role' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: 'Unauthorized Password is incorrect' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.Roles[0].name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  const { username, oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  try {
    // Fetch user by username
    const user = await userRepository.findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password matches
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: 'Old password is incorrect' });
    }

    // Update user's password
    await userRepository.updateUserPassword(userId, newPassword);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
