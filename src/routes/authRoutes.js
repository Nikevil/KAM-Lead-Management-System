const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


//routes to login
router.post('/login', authController.login);

module.exports = router;