const asyncHandler = require('express-async-handler');
const Order = require('../models/orderSchema');
const Gig = require('../models/gigSchema');

// @desc Retrieve client orders
// @route GET /api/orders
// @access Private
const getClientOrders = asyncHandler(async (req, res) => {
    const { status } = req.query; // Optional query parameter for filtering by status
    const query = { client: req.user.id };

    if (status) {
        query.status = status;
    }

    const orders = await Order.find(query)
        .populate('gig', 'title description') // Include specific fields from the Gig
        .select('status amount downloadLink createdAt updatedAt') // Include specific fields
        .sort({ createdAt: -1 });

    res.status(200).json(orders);
});

// @desc Place a custom order
// @route POST /api/orders/custom
// @access Private
const placeCustomOrder = asyncHandler(async (req, res) => {
    const { gigId, amount, paymentMethod } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
    }

    const order = new Order({
        gig: gigId,
        client: req.user.id,
        freelancer: gig.createdBy,
        amount,
        paymentMethod,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

module.exports = { getClientOrders, placeCustomOrder };
