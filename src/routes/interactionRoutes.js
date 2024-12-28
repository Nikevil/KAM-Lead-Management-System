const express = require('express');
const interactionController = require('../controllers/interactionController');
// const validationMiddleware = require('../middlewares/validationMiddleware');
// const interactionValidation = require('../validations/interactionValidation');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize.js');


// Route to create a new interaction (requires authentication and authorization)
router.post('/', authenticate, authorize(['Admin', 'Kam']), interactionController.createInteraction);

// Route to get interactions by id (requires authentication)
router.get('/:id', authenticate, interactionController.getInteractionById);

// Route to get all interactions for a specific lead (requires authentication)
router.get('/lead/:leadId', authenticate, interactionController.getInteractionsByLeadId);

// Route to update an interaction by its ID (requires authentication and authorization)
router.put('/:id', authenticate, authorize(['Admin', 'Kam']), interactionController.updateInteraction);

// Route to delete an interaction by its ID (requires authentication and authorization)
router.delete('/:id', authenticate, authorize(['Admin']), interactionController.deleteInteraction);


module.exports = router;