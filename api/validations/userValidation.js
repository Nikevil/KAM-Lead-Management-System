const Joi = require('joi');

// Schema for adding a new user
const addUserValidationSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  username: Joi.string().min(3).max(255).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(10).max(15).required(),
  status: Joi.string().valid('active', 'inactive').optional(),
  roles: Joi.array().items(Joi.number()).optional(), // Role IDs (array of integers)
});

// Schema for updating an existing user
const updateUserValidationSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  username: Joi.string().min(3).max(255).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(10).max(15).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  roles: Joi.array().items(Joi.number()).optional(), // Role IDs (array of integers)
});

// Schema for user ID validation (for getting, updating, or deleting by ID)
const userIdValidationSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  addUserValidationSchema,
  updateUserValidationSchema,
  userIdValidationSchema,
};
