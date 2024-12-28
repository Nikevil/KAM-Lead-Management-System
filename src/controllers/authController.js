const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Fetch user along with their associated roles
    const user = await userRepository.findUserByUsername(username);

    if (!user || user.Roles.length === 0) {
      return res
        .status(401)
        .json({ message: "User must have at least one role" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Unauthorized Password is incorrect" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.Roles[0].name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
