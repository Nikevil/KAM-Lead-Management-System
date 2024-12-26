const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

// Create a new contact for a lead
router.post('/', authenticate, authorize('Admin', 'Kam'), contactController.addContact);

// Add contacts to a lead
router.post('/lead', authenticate, authorize('Admin', 'Kam'), contactController.addContactsToLead);

// Get a contact by ID
router.get('/:id', authenticate, contactController.getContactById);

// Get all contacts for a specific lead
router.get('/lead/:leadId', authenticate, contactController.getContactsByLeadId);

// Update a contact by ID
router.put('/:id', authenticate, authorize('Admin', 'Kam'), contactController.updateContact);

// Delete a contact by ID
router.delete('/:id', authenticate, authorize('Admin'), contactController.deleteContact);

module.exports = router;
