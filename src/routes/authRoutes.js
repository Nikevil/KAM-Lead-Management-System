const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginValidationSchema } = require("../validations/authValidation");
const validate = require("../middlewares/validationMiddleware");

//routes to login
router.post(
  "/login",
  validate({ body: loginValidationSchema }),
  authController.login
);

module.exports = router;
