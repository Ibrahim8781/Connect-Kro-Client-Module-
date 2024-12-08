const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { placeCustomOrder, getClientOrders } = require('../controllers/orderController');

// Retrieve client orders (with optional filtering by status)
router.get('/', protect, roleMiddleware(['client']), getClientOrders);

// Place a custom order
router.post('/custom', protect, roleMiddleware(['client']), placeCustomOrder);

module.exports = router;
