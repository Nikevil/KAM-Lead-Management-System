const Joi = require('joi');

// Schema for getting all roles with optional filters (GET /roles)
const getRolesValidationSchema = Joi.object({
  filters: Joi.string().optional(),  // Filters should be a string (can be parsed and handled on the server side)
});

// Schema for getting a role by ID (GET /roles/:id)
const getRoleByIdValidationSchema = Joi.object({
  id: Joi.number().integer().required(),  // Role ID should be an integer
});

module.exports = {
  getRolesValidationSchema,
  getRoleByIdValidationSchema,
};
