const express = require('express');
const interactionController = require('../controllers/interactionController');
// const validationMiddleware = require('../middlewares/validationMiddleware');
// const interactionValidation = require('../validations/interactionValidation');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize.js');

router.post('/', authenticate, authorize(['Admin', 'Kam']), interactionController.createInteraction);
router.get('/:id', authenticate, interactionController.getInteractionById);
router.get('/lead/:leadId', authenticate, interactionController.getInteractionsByLeadId);
router.put('/:id', authenticate, authorize(['Admin', 'Kam']), interactionController.updateInteraction);
router.delete('/:id', authenticate, authorize(['Admin']), interactionController.deleteInteraction);


module.exports = router;