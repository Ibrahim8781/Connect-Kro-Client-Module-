// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getPaymentHistory,
} = require('../controllers/paymentController');

// Add a new payment method
router.post('/', protect, addPaymentMethod);

// Update an existing payment method
router.put('/:id', protect, updatePaymentMethod);

// Delete a payment method
router.delete('/:id', protect, deletePaymentMethod);

// Get payment history
router.get('/history', protect, getPaymentHistory);

module.exports = router;
