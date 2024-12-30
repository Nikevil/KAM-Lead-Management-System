const express = require("express");
const interactionController = require("../controllers/interactionController");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize.js");
const validate = require("../middlewares/validationMiddleware");
const { createInteractionValidationSchema, updateInteractionValidationSchema, validateIdSchema, validateLeadIdSchema} = require("../validations/interactionValidation");

// Route to create a new interaction (requires authentication and authorization)
router.post(
  "/",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate(createInteractionValidationSchema),
  interactionController.addInteraction
);

// Route to get interactions by id (requires authentication)
router.get("/:id", authenticate, validate(validateIdSchema), interactionController.getInteractionById);

// Route to get all interactions for a specific lead (requires authentication)
router.get(
  "/lead/:leadId",
  authenticate,
  validate(validateLeadIdSchema),
  interactionController.getInteractionsByLeadId
);

// Route to update an interaction by its ID (requires authentication and authorization)
router.put(
  "/:id",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate(validateIdSchema),
  validate(updateInteractionValidationSchema),
  interactionController.updateInteraction
);

// Route to delete an interaction by its ID (requires authentication and authorization)
router.delete(
  "/:id",
  authenticate,
  authorize(["Admin"]),
  validate(validateIdSchema),
  interactionController.deleteInteraction
);

module.exports = router;
