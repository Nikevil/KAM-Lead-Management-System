const Joi = require('joi');

const createInteraction = Joi.object({
  leadId: Joi.number().integer().required().messages({
    'any.required': 'Lead ID is required',
    'number.base': 'Lead ID must be a number',
  }),
  date: Joi.date().required().messages({
    'any.required': 'Date is required',
    'date.base': 'Invalid date format',
  }),
  type: Joi.string().valid('call', 'order', 'meeting').required().messages({
    'any.required': 'Type is required',
    'any.only': 'Type must be one of call, order, or meeting',
  }),
  notes: Joi.string().allow('').optional().messages({
    'string.base': 'Notes must be a string',
  }),
});

module.exports = { createInteraction };