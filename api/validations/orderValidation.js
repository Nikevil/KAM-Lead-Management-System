const Joi = require("joi");

const createOrderSchema = Joi.object({
  leadId: Joi.number().integer().required().messages({
    "any.required": "leadId is required",
    "number.base": "leadId must be a number",
  }),
  amount: Joi.number().greater(0).required().messages({
    "any.required": "amount is required",
    "number.base": "amount must be a number",
    "number.greater": "amount must be greater than 0",
  }),
  productCategories: Joi.array()
    .items(Joi.string().valid("electronics", "appliances", "furniture", "clothing", "groceries"))
    .required()
    .messages({
      "array.base": "productCategories must be an array of strings",
      "any.required": "productCategories is required",
      "string.base": "Each productCategory must be a string",
      "any.only": "productCategories must contain valid categories",
    }),
  orderDate: Joi.date().iso().required().messages({
    "any.required": "orderDate is required",
    "date.base": "orderDate must be a valid date",
    "date.format": "orderDate must be in ISO format",
  }),
  status: Joi.string().valid("pending", "completed", "cancelled").required().messages({
    "any.required": "status is required",
    "string.base": "status must be a string",
    "any.only": "status must be one of 'pending', 'completed', or 'cancelled'",
  }),
  notes: Joi.string().optional().allow(null).messages({
    "string.base": "notes must be a string",
  }),
  orderDetails: Joi.array()
    .items(
      Joi.object({
        productName: Joi.string().required().messages({
          "any.required": "productName is required",
          "string.base": "productName must be a string",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "any.required": "quantity is required",
          "number.base": "quantity must be a number",
          "number.min": "quantity must be at least 1",
        }),
        price: Joi.number().greater(0).required().messages({
          "any.required": "price is required",
          "number.base": "price must be a number",
          "number.greater": "price must be greater than 0",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "orderDetails must be an array",
      "any.required": "orderDetails is required",
    }),
});

const updateOrderSchema = Joi.object({
  leadId: Joi.number().integer().optional(),
  amount: Joi.number().greater(0).optional().messages({
    "number.base": "amount must be a number",
    "number.greater": "amount must be greater than 0",
  }),
  productCategories: Joi.array()
    .items(Joi.string().valid("electronics", "appliances", "furniture", "clothing", "groceries"))
    .optional()
    .messages({
      "array.base": "productCategories must be an array of strings",
      "string.base": "Each productCategory must be a string",
      "any.only": "productCategories must contain valid categories",
    }),
  orderDate: Joi.date().iso().optional().messages({
    "date.base": "orderDate must be a valid date",
    "date.format": "orderDate must be in ISO format",
  }),
  status: Joi.string().valid("pending", "completed", "cancelled").optional().messages({
    "string.base": "status must be a string",
    "any.only": "status must be one of 'pending', 'completed', or 'cancelled'",
  }),
  notes: Joi.string().optional().allow(null).messages({
    "string.base": "notes must be a string",
  }),
  orderDetails: Joi.array()
    .items(
      Joi.object({
        productName: Joi.string().optional().messages({
          "string.base": "productName must be a string",
        }),
        quantity: Joi.number().integer().min(1).optional().messages({
          "number.base": "quantity must be a number",
          "number.min": "quantity must be at least 1",
        }),
        price: Joi.number().greater(0).optional().messages({
          "number.base": "price must be a number",
          "number.greater": "price must be greater than 0",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "orderDetails must be an array",
    }),
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
