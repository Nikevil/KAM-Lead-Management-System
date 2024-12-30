const Joi = require('joi');

// Schema for creating a new interaction
const createInteractionValidationSchema = Joi.object({
  leadId: Joi.number().integer().required().messages({
    "any.required": "leadId is required",
    "number.base": "leadId must be a number",
  }),
  contactId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "contactId must be a number",
  }),
  interactionType: Joi.string().valid("call", "email", "meeting", "other").required().messages({
    "any.required": "interactionType is required",
    "string.base": "interactionType must be a string",
    "any.only": "interactionType must be one of 'call', 'email', 'meeting', or 'other'",
  }),
  interactionDate: Joi.date().optional().default(Date.now).messages({
    "date.base": "interactionDate must be a valid date",
  }),
  duration: Joi.number().integer().optional().allow(null).messages({
    "number.base": "duration must be a number",
  }),
  outcome: Joi.string().optional().allow(null).messages({
    "string.base": "outcome must be a string",
  }),
  notes: Joi.string().optional().allow(null).messages({
    "string.base": "notes must be a string",
  }),
  orderId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "orderId must be a number",
  }),
});

// Schema for updating an existing interaction
const updateInteractionValidationSchema = Joi.object({
  leadId: Joi.number().integer().optional(),
  userId: Joi.number().integer().optional().allow(null),
  contactId: Joi.number().integer().optional().allow(null),
  interactionType: Joi.string().valid("call", "email", "meeting", "other").optional(),
  interactionDate: Joi.date().optional(),
  duration: Joi.number().integer().optional().allow(null),
  outcome: Joi.string().optional().allow(null),
  notes: Joi.string().optional().allow(null),
  orderId: Joi.number().integer().optional().allow(null),
});

// Schema for validating ID (used in get and delete)
const validateIdSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    "any.required": "ID is required",
    "number.base": "ID must be a number",
  }),
});

const validateLeadIdSchema = Joi.object({
  leadId: Joi.number().integer().required().messages({
    "any.required": "leadId is required",
    "number.base": "leadId must be a number",
  }),
});

module.exports = {
  createInteractionValidationSchema,
  updateInteractionValidationSchema,
  validateIdSchema,
  validateLeadIdSchema,
};
