const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validationMiddleware');
const {
  getRolesValidationSchema,
  getRoleByIdValidationSchema,
} = require('../validations/roleValidation');

//Get all roles
router.get(
  '/',
  authenticate,
  validate({
    query: getRolesValidationSchema,
  }),
  roleController.getRoles,
);

// Get role by ID
router.get(
  '/:id',
  authenticate,
  validate({
    params: getRoleByIdValidationSchema,
  }),
  roleController.getRoleById,
);

module.exports = router;
