const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const authenticate = require('../middlewares/authenticate.js');
const authorize = require('../middlewares/authorize.js');
const validate = require('../middlewares/validationMiddleware.js');
const {
  addUserValidationSchema,
  updateUserValidationSchema,
  userIdValidationSchema,
} = require('../validations/userValidation.js');

// Route to create a new user (requires authentication and authorization)
router.post(
  '/',
  authenticate,
  authorize('Admin'),
  validate({
    body: addUserValidationSchema,
  }),
  userController.addUser,
);

// Route to get all users (requires authentication and authorization)
router.get('/', authenticate, userController.getUsers);

// Route to get a specific user by its ID (requires authentication and authorization)
router.get(
  '/:id',
  authenticate,
  validate({
    params: userIdValidationSchema,
  }),
  userController.getUserById,
);

// Route to update a user by its ID (requires authentication and authorization)
router.put(
  '/:id',
  authenticate,
  authorize('Admin'),
  validate({
    params: userIdValidationSchema,
    body: updateUserValidationSchema,
  }),
  userController.updateUser,
);

// Route to delete a user by its ID (requires authentication and authorization)
router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  validate({
    params: userIdValidationSchema,
  }),
  userController.deleteUser,
);

module.exports = router;
