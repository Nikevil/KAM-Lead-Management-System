const Joi = require('joi');

// Schema for creating a new contact
const createContactValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'any.required': 'name is required',
    'string.base': 'name must be a string',
    'string.min': 'name must be at least 2 characters',
    'string.max': 'name must be less than 50 characters',
  }),
  phone: Joi.string()
    .min(10)
    .max(15)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'any.required': 'phone is required',
      'string.base': 'phone must be a string',
      'string.min': 'phone must be at least 10 characters',
      'string.max': 'phone must be less than 15 characters',
      'string.pattern.base': 'phone must contain only digits',
    }),
  email: Joi.string().email().optional().messages({
    'string.email': 'email must be a valid email address',
  }),
  role: Joi.string().required(),
});

// Schema for updating a contact
const updateContactValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string()
    .min(10)
    .max(15)
    .pattern(/^[0-9]+$/)
    .optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().optional(),
});

// Schema for validating ID (used in get, delete, update routes)
const validateIdSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'any.required': 'ID is required',
    'number.base': 'ID must be a number',
  }),
});

const validateLeadIdSchema = Joi.object({
  leadId: Joi.number().integer().required().messages({
    'any.required': 'leadId is required',
    'number.base': 'leadId must be a number',
  }),
});

const validateLeadContactsSchema = Joi.object({
  leadId: Joi.number().integer().required().messages({
    'any.required': 'leadId is required',
    'number.base': 'leadId must be a number',
  }),
  contacts: Joi.array()
    .items(
      Joi.object().keys({
        name: Joi.string().min(2).max(50).required().messages({
          'any.required': 'name is required',
          'string.base': 'name must be a string',
          'string.min': 'name must be at least 2 characters',
          'string.max': 'name must be less than 50 characters',
        }),
        phone: Joi.string()
          .min(10)
          .max(15)
          .pattern(/^[0-9]+$/)
          .required()
          .messages({
            'any.required': 'phone is required',
            'string.base': 'phone must be a string',
            'string.min': 'phone must be at least 10 characters',
            'string.max': 'phone must be less than 15 characters',
            'string.pattern.base': 'phone must contain only digits',
          }),
        email: Joi.string().email().optional().messages({
          'string.email': 'email must be a valid email address',
        }),
        role: Joi.string().required(),
      }),
    )
    .required()
    .messages({
      'any.required': 'contacts is required',
      'array.base': 'contacts must be an array',
    }),
});

module.exports = {
  createContactValidationSchema,
  updateContactValidationSchema,
  validateIdSchema,
  validateLeadIdSchema,
  validateLeadContactsSchema,
};
