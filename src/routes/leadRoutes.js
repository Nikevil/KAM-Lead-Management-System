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
