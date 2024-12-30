const express = require("express");
const interactionController = require("../controllers/interactionController.js");
const router = express.Router();
const authenticate = require("../middlewares/authenticate.js");
const authorize = require("../middlewares/authorize.js");
const validate = require("../middlewares/validationMiddleware.js");
const {
  createInteractionValidationSchema,
  updateInteractionValidationSchema,
  validateIdSchema,
  validateLeadIdSchema,
} = require("../validations/interactionValidation.js");

// Route to create a new interaction (requires authentication and authorization)
router.post(
  "/",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    body: createInteractionValidationSchema,
  }),
  interactionController.addInteraction
);

// Route to get interactions by id (requires authentication)
router.get(
  "/:id",
  authenticate,
  validate({
    params: validateIdSchema,
  }),
  interactionController.getInteractionById
);

// Route to get all interactions for a specific lead (requires authentication)
router.get(
  "/lead/:leadId",
  authenticate,
  validate({
    params: validateLeadIdSchema,
  }),
  interactionController.getInteractionsByLeadId
);

// Route to update an interaction by its ID (requires authentication and authorization)
router.put(
  "/:id",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    params: validateIdSchema,
    body: updateInteractionValidationSchema,
  }),
  interactionController.updateInteraction
);

// Route to delete an interaction by its ID (requires authentication and authorization)
router.delete(
  "/:id",
  authenticate,
  authorize(["Admin"]),
  validate({
    params: validateIdSchema,
  }),
  interactionController.deleteInteraction
);

module.exports = router;
