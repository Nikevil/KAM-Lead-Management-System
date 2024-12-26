const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

// Create a new role
router.post('/', authenticate, authorize('Admin'), roleController.addRole);

// Get role by ID
router.get('/:id', authenticate, roleController.getRoleById);

//Get all roles
router.get('/', authenticate, roleController.getRoles);

// Update role by ID
router.put('/:id', authenticate, authorize('Admin'), roleController.updateRole);

// Delete role by ID
router.delete('/:id', authenticate, authorize('Admin'), roleController.deleteRole);

module.exports = router;
