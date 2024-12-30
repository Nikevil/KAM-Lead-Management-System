module.exports = function authorize(roles = []) {
  // If roles is a string, convert it into an array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Ensure req.user is available and has roles
    if (!req.user || !req.user.Roles || req.user.Roles.length === 0) {
      return res
        .status(403)
        .json({ message: 'Forbidden, no roles assigned to user' });
    }

    // Check if any of the user's roles match the required roles
    const userRoles = req.user.Roles.map((role) => role.name); // Assuming `role.name` is the field that stores the role name

    const hasRequiredRole = userRoles.some((role) => roles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Forbidden, insufficient role' });
    }

    // If the user has the required role, proceed to the next middleware or route handler
    next();
  };
};
