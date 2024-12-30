const validationMiddleware = (schemas) => (req, res, next) => {
  // Validate each part of the request if the corresponding schema is provided
  const validations = Object.keys(schemas).map((key) => {
    if (schemas[key]) {
      const { error } = schemas[key].validate(req[key]);
      if (error) {
        return { key, message: error.details[0].message };
      }
    }
    return null;
  });

  // Check for validation errors
  const error = validations.find((result) => result !== null);
  if (error) {
    return res.status(400).json({ message: `Invalid ${error.key}: ${error.message}` });
  }

  next();
};

module.exports = validationMiddleware;
