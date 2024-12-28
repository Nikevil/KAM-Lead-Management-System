const express = require('express');
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const router = express.Router();


// Route to create a new order (requires authentication and authorization)
router.post('/', authenticate, authorize(['Admin', 'Kam']), orderController.createOrder);

// Route to get filtered orders (e.g., by date range or product category)
router.get('/filtered', authenticate,  orderController.getFilteredOrders);

// Route to get ordering patterns
router.get("/ordering-patterns", authenticate, authorize(['Admin', 'Kam']), orderController.getOrderingPatterns);

// Route to get all orders for a specific lead (requires authentication and authorization)
router.get('/lead/:leadId', authenticate, orderController.getOrdersByLeadId);

// Route to get a specific order by its ID (requires authentication and authorization)
router.get('/:id', authenticate, orderController.getOrderById);

// Route to update an order by its ID (requires authentication and authorization)
router.put('/:id', authenticate, authorize(['Admin', 'Kam']), orderController.updateOrder);

// Route to delete an order by its ID (requires authentication and authorization)
router.delete('/:id', authenticate, authorize(['Admin']), orderController.deleteOrder);



module.exports = router;
