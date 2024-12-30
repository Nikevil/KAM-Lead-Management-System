const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validationMiddleware");
const {
  createContactValidationSchema,
  updateContactValidationSchema,
  validateIdSchema,
  validateLeadIdSchema,
  validateLeadContactsSchema,
} = require("../validations/contactValidation");


// Add contacts to a lead
router.post(
  "/lead",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    body: validateLeadContactsSchema,
  }),
  contactController.addContactsToLead
);

// Get a contact by ID
router.get(
  "/:id",
  authenticate,
  validate({
    params: validateIdSchema,
  }),
  contactController.getContactById
);

// Get all contacts for a specific lead
router.get(
  "/lead/:leadId",
  authenticate,
  validate({
    params: validateLeadIdSchema,
  }),
  contactController.getContactsByLeadId
);

// Update a contact by ID
router.put(
  "/:id",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    params: validateIdSchema,
    body: updateContactValidationSchema,
  }),
  contactController.updateContact
);

// Delete a contact by ID
router.delete(
  "/:id",
  authenticate,
  authorize(["Admin"]),
  validate({
    params: validateIdSchema,
  }),
  contactController.deleteContact
);

module.exports = router;
