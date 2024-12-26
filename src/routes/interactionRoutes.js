const express = require('express');
const interactionController = require('../controllers/interactionController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const interactionValidation = require('../validations/interactionValidation');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize.js');

router.get('/', authenticate, authorize(['admin', 'kam', 'manager', 'sales']), interactionController.getInteractions);
router.post('/', authenticate, authorize(['admin', 'kam', 'manager']), validationMiddleware(interactionValidation.createInteraction), interactionController.createInteraction);

module.exports = router;