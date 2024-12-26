const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize.js');

router.post('/', authenticate, authorize('Admin'), userController.addUser);
router.get('/', authenticate, userController.getAllUsers);
router.get('/:id',authenticate, userController.getUserById);
router.put('/:id', authenticate, authorize('Admin'), userController.updateUser);
router.delete('/:id', authenticate, authorize('Admin'), userController.deleteUser);

module.exports = router;