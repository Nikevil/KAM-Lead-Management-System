const Joi = require('joi');

const loginValidationSchema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  password: Joi.string().min(6).required(),
});

const changePasswordValidationSchema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = { loginValidationSchema, changePasswordValidationSchema };
