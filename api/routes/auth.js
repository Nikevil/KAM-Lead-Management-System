const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  loginValidationSchema,
  changePasswordValidationSchema,
} = require('../validations/authValidation');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validationMiddleware');

//route to login
router.post(
  '/login',
  validate({ body: loginValidationSchema }),
  authController.login,
);

//route to change password
router.put(
  '/change-password',
  authenticate,
  validate({ body: changePasswordValidationSchema }),
  authController.changePassword,
);

module.exports = router;
