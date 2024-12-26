// File: src/validations/leadValidation.js
const Joi = require('joi');

const createLead = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().optional(),
  type: Joi.string().optional(),
  status: Joi.string().valid('new', 'in_progress', 'converted', 'inactive').optional(),
  callFrequency: Joi.number().integer().positive().optional(),
});

module.exports = { createLead };
