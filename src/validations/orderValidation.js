const Joi = require("joi");

const createOrderSchema = Joi.object({
  leadId: Joi.number().integer().required(),
  orderDate: Joi.date().required(),
  amount: Joi.number().positive().required(),
  productCategories: Joi.array().items(Joi.string()).optional(), // This is an array of strings
  status: Joi.string().valid('pending', 'completed', 'cancelled').optional(), // assuming only these statuses are allowed
});

const updateOrderSchema = Joi.object({
  leadId: Joi.number().integer().optional(),
  orderDate: Joi.date().optional(),
  amount: Joi.number().positive().optional(),
  productCategories: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('pending', 'completed', 'cancelled').optional(),
});

const getOrdersByLeadIdSchema = Joi.object({
  leadId: Joi.number().integer().required(),
});

const getOrderByIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

const getFilteredOrdersSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  productCategory: Joi.string().optional(),
});

const deleteOrderSchema = Joi.object({
  id: Joi.number().integer().required(),
});

const getOrderingPatternsSchema = Joi.object({
  leadId: Joi.number().integer().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  limit: Joi.number().integer().min(1).optional(),
  offset: Joi.number().integer().min(0).optional(),
});

module.exports = {
  createOrderSchema,
  updateOrderSchema,
  getOrdersByLeadIdSchema,
  getOrderByIdSchema,
  getFilteredOrdersSchema,
  deleteOrderSchema,
  getOrderingPatternsSchema,
};
