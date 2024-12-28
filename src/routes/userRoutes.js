const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize.js');


// Route to create a new user (requires authentication and authorization)
router.post('/', authenticate, authorize('Admin'), userController.addUser);

// Route to get all users (requires authentication and authorization)
router.get('/', authenticate, userController.getUsers);

// Route to get a specific user by its ID (requires authentication and authorization)
router.get('/:id',authenticate, userController.getUserById);

// Route to update a user by its ID (requires authentication and authorization)
router.put('/:id', authenticate, authorize('Admin'), userController.updateUser);

// Route to delete a user by its ID (requires authentication and authorization)
router.delete('/:id', authenticate, authorize('Admin'), userController.deleteUser);

module.exports = router;