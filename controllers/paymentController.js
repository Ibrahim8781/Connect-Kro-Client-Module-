// controllers/paymentController.js
const asyncHandler = require('express-async-handler');
const PaymentMethod = require('../models/paymentMethodSchema');
const Order = require('../models/orderSchema');

// @desc Add a new payment method
// @route POST /api/payments
// @access Private
const addPaymentMethod = asyncHandler(async (req, res) => {
    const { type, details, isDefault } = req.body;

    // If setting as default, unset other default methods for this user
    if (isDefault) {
        await PaymentMethod.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const paymentMethod = new PaymentMethod({
        user: req.user.id,
        type,
        details,
        isDefault,
    });

    const createdMethod = await paymentMethod.save();
    res.status(201).json(createdMethod);
});

// @desc Update a payment method
// @route PUT /api/payments/:id
// @access Private
const updatePaymentMethod = asyncHandler(async (req, res) => {
    const { type, details, isDefault } = req.body;
    const paymentMethod = await PaymentMethod.findById(req.params.id);

    if (!paymentMethod || paymentMethod.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('Payment method not found');
    }

    // Update fields
    paymentMethod.type = type || paymentMethod.type;
    paymentMethod.details = details || paymentMethod.details;

    // If setting as default, unset other default methods for this user
    if (isDefault) {
        await PaymentMethod.updateMany({ user: req.user.id }, { isDefault: false });
        paymentMethod.isDefault = true;
    }

    const updatedMethod = await paymentMethod.save();
    res.status(200).json(updatedMethod);
});

// @desc Delete a payment method
// @route DELETE /api/payments/:id
// @access Private
const deletePaymentMethod = asyncHandler(async (req, res) => {
    const paymentMethod = await PaymentMethod.findById(req.params.id);

    if (!paymentMethod || paymentMethod.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('Payment method not found');
    }

    await paymentMethod.remove();
    res.status(200).json({ message: 'Payment method removed' });
});

// @desc Get user's payment history
// @route GET /api/payments/history
// @access Private
const getPaymentHistory = asyncHandler(async (req, res) => {
    const orders = await Order.find({ client: req.user.id })
        .select('amount paymentMethod createdAt transactionId')
        .sort({ createdAt: -1 });

    res.status(200).json(orders);
});

module.exports = {
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getPaymentHistory,
};
