const express = require("express");
const leadController = require("../controllers/leadController");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validationMiddleware");
const {
  addLeadValidationSchema,
  updateLeadValidationSchema,
  getLeadPerformanceMetricsValidationSchema,
  updateCallFrequencyValidationSchema,
  recordCallValidationSchema,
  transferLeadsValidationSchema,
  getLeadPerformanceMetricsValidationSchema,
  validateIdSchema,
  validateLeadIdSchema
} = require("../validations/leadValidation");

// Add a new lead
router.post(
  "/",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    body: addLeadValidationSchema
  }),
  leadController.addLead
);

// Get all leads
router.get(
  "/",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.getLeads
);

// Get leads requiring calls today
router.get(
  "/leads-requiring-calls",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.getLeadsRequiringCalls
);

// Get Well Performing Accounts
router.get(
  "/well-performing",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.getWellPerformingAccounts
);

// Get Under Performing Accounts
router.get(
  "/under-performing",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.getUnderPerformingAccounts
);

// Get Lead Performance Metrics
router.get(
  "/performance",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    query: getLeadPerformanceMetricsValidationSchema
  }),
  leadController.getLeadPerformanceMetrics
);

// Transfer Leads
router.put(
  "/transfer-leads",
  authenticate,
  authorize(["Admin"]),
  validate({
    body: transferLeadsValidationSchema
  }),
  leadController.transferLeads
);

// Get a lead by ID
router.get(
  "/:id",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    params: validateIdSchema
  }),
  leadController.getLeadById
);

// Update a lead by ID
router.put(
  "/:id",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
   params: validateIdSchema,
   body: updateLeadValidationSchema
   }),
  leadController.updateLead
);

// Delete a lead by ID
router.delete(
  "/:id",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    params: validateIdSchema
  }),
  leadController.deleteLead
);

// Update call frequency for a lead
router.patch(
  "/call-frequency/:leadId",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    params: validateLeadIdSchema,
    body: updateCallFrequencyValidationSchema,
  }),
  leadController.updateCallFrequency
);

// Record a call for a lead
router.patch(
  "/record-call/:leadId",
  authenticate,
  authorize(["Admin", "Kam"]),
  validate({
    params: recordCallValidationSchema,
  }),
  leadController.recordCall
);

module.exports = router;
