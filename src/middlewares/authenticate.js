const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

// Middleware to authenticate the user
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userRepository.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
