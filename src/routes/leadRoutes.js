const express = require("express");
const leadController = require("../controllers/leadController");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");


// Add a new lead
router.post("/", authenticate, authorize(["Admin", "Kam"]), leadController.addLead);

// Get all leads
router.get("/", authenticate, authorize(["Admin", "Kam"]), leadController.getLeads);

// Get leads requiring calls today
router.get("/leads-requiring-calls", authenticate, authorize(["Admin", "Kam"]), leadController.getLeadsRequiringCalls);

// Get Well Performing Accounts
router.get("/well-performing", authenticate, authorize(["Admin", "Kam"]), leadController.getWellPerformingAccounts);

// Get Under Performing Accounts
router.get("/under-performing", authenticate, authorize(["Admin", "Kam"]), leadController.getUnderPerformingAccounts);

// Get Lead Performance Metrics
router.get("/performance", authenticate, authorize(["Admin", "Kam"]), leadController.getLeadPerformanceMetrics);

// Transfer Leads
router.put('/transfer-leads', authenticate, authorize(["Admin"]), leadController.transferLeads);

// Get a lead by ID
router.get("/:id", authenticate, authorize(["Admin", "Kam"]), leadController.getLeadById);

// Update a lead by ID
router.put("/:id", authenticate, authorize(["Admin", "Kam"]), leadController.updateLead);

// Delete a lead by ID
router.delete("/:id", authenticate, authorize(["Admin", "Kam"]), leadController.deleteLead);

// Update call frequency for a lead
router.patch("/call-frequency/:leadId", authenticate, authorize(["Admin", "Kam"]), leadController.updateCallFrequency);

// Record a call for a lead
router.patch("/record-call/:leadId", authenticate, authorize(["Admin", "Kam"]), leadController.recordCall);

module.exports = router;
