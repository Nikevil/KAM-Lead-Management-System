const express = require('express');
const leadController = require('../controllers/leadController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize.js');

router.post('/', authenticate, authorize(['Admin', 'kam']), leadController.addLead);
router.get('/', authenticate, authorize(['Admin', 'kam']), leadController.getLeads);
router.get('/:id', authenticate, authorize(['Admin', 'kam']), leadController.getLeadById);
router.put('/:id', authenticate, authorize(['Admin', 'kam']), leadController.updateLead);
router.delete('/:id', authenticate, authorize(['Admin', 'kam']), leadController.deleteLead);

module.exports = router;