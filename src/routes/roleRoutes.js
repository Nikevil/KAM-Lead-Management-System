const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require('../middlewares/authenticate');



// Get role by ID
router.get('/:id', authenticate, roleController.getRoleById);

//Get all roles
router.get('/', authenticate, roleController.getRoles);


module.exports = router;
