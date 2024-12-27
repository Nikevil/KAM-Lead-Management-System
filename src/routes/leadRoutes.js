const express = require("express");
const leadController = require("../controllers/leadController");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize.js");

router.post(
  "/",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.addLead
);
router.get(
  "/",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.getLeads
);
router.get(
  "/:id",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.getLeadById
);
router.put(
  "/:id",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.updateLead
);
router.delete(
  "/:id",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.deleteLead
);
router.put(
  "/call-frequency",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.updateCallFrequency
);

// Get leads requiring calls today
router.get(
  "/leads-requiring-calls",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.getLeadsRequiringCalls
);

// Record a call for a lead
router.post(
  "/record-call",
  authenticate,
  authorize(["Admin", "Kam"]),
  leadController.recordCall
);

module.exports = router;
