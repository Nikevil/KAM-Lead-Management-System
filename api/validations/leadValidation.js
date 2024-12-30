const Joi = require('joi');

// Schema for adding a new lead
const addLeadValidationSchema = Joi.object({
  restaurantName: Joi.string().min(3).required().messages({
    'string.base': 'Restaurant Name must be a string',
    'string.empty': 'Restaurant Name cannot be empty',
    'string.min': 'Restaurant Name should have at least 3 characters',
    'any.required': 'Restaurant Name is required',
  }),
  cuisineType: Joi.array()
    .items(Joi.string().valid('Italian', 'Indian', 'Chinese', 'Mexican'))
    .required()
    .messages({
      'array.base': 'Cuisine Type must be an array of strings',
      'array.includes': 'Cuisine Type can only be one of the specified types',
      'any.required': 'Cuisine Type is required',
    }),
  location: Joi.string().min(3).required().messages({
    'string.base': 'Location must be a string',
    'string.empty': 'Location cannot be empty',
    'string.min': 'Location should have at least 3 characters',
    'any.required': 'Location is required',
  }),
  leadSource: Joi.string()
    .valid('Advertisement', 'Referral', 'Direct', 'Online')
    .required()
    .messages({
      'string.base': 'Lead Source must be a string',
      'any.required': 'Lead Source is required',
      'any.only':
        'Lead Source must be one of the following: Advertisement, Referral, Direct, Online',
    }),
  leadStatus: Joi.string()
    .valid('New', 'In Progress', 'Follow Up', 'Closed', 'Won', 'Lost')
    .default('New'),
  callFrequency: Joi.number().integer().min(1).max(30).default(7).messages({
    'number.base': 'Call Frequency must be an integer',
    'number.min': 'Call Frequency should be at least 1',
    'number.max': 'Call Frequency should not exceed 30',
  }),
  kamId: Joi.number().integer().required().messages({
    'number.base': 'Kam ID must be a number',
    'any.required': 'Kam ID is required',
  }),
});

// Schema for updating a lead
const updateLeadValidationSchema = Joi.object({
  restaurantName: Joi.string().min(3).optional(),
  cuisineType: Joi.array()
    .items(Joi.string().valid('Italian', 'Indian', 'Chinese', 'Mexican'))
    .optional(),
  location: Joi.string().min(3).optional(),
  leadSource: Joi.string()
    .valid('Advertisement', 'Referral', 'Direct', 'Online')
    .optional(),
  leadStatus: Joi.string()
    .valid('New', 'In Progress', 'Follow Up', 'Closed', 'Won', 'Lost')
    .optional(),
  callFrequency: Joi.number().integer().min(1).max(30).optional(),
});

// Schema for updating call frequency
const updateCallFrequencyValidationSchema = Joi.object({
  callFrequency: Joi.number().integer().min(1).max(30).required().messages({
    'number.base': 'Call Frequency must be an integer',
    'number.min': 'Call Frequency should be at least 1',
    'number.max': 'Call Frequency should not exceed 30',
    'any.required': 'Call Frequency is required',
  }),
});

// Schema for recording a call
const recordCallValidationSchema = Joi.object({
  leadId: Joi.number().integer().required().messages({
    'number.base': 'Lead ID must be a number',
    'any.required': 'Lead ID is required',
  }),
});

// Schema for transferring leads
const transferLeadsValidationSchema = Joi.object({
  oldUserId: Joi.number().integer().required().messages({
    'number.base': 'Old User ID must be a number',
    'any.required': 'Old User ID is required',
  }),
  newUserId: Joi.number().integer().required().messages({
    'number.base': 'New User ID must be a number',
    'any.required': 'New User ID is required',
  }),
});

// Schema for getting lead performance metrics
const getLeadPerformanceMetricsValidationSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'number.base': 'Lead ID must be a number',
    'any.required': 'Lead ID is required',
  }),
});

const validateIdSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'any.required': 'id is required',
    'number.base': 'id must be a number',
  }),
});

const validateLeadIdSchema = Joi.object({
  leadId: Joi.number().integer().required().messages({
    'any.required': 'leadId is required',
    'number.base': 'leadId must be a number',
  }),
});

module.exports = {
  addLeadValidationSchema,
  updateLeadValidationSchema,
  updateCallFrequencyValidationSchema,
  recordCallValidationSchema,
  transferLeadsValidationSchema,
  getLeadPerformanceMetricsValidationSchema,
  validateIdSchema,
  validateLeadIdSchema,
};
