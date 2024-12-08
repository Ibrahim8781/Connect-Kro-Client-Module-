const asyncHandler = require('express-async-handler');
const SupportTicket = require('../models/supportTicketSchema');

// @desc Create a new support ticket
// @route POST /api/support-tickets
// @access Private
const createTicket = asyncHandler(async (req, res) => {
    const { issue } = req.body;

    const ticket = new SupportTicket({
        user: req.user.id,
        issue,
    });

    const createdTicket = await ticket.save();
    res.status(201).json(createdTicket);
});

// @desc Get all support tickets for the client
// @route GET /api/support-tickets
// @access Private
const getClientTickets = asyncHandler(async (req, res) => {
    const tickets = await SupportTicket.find({ user: req.user.id });
    res.json(tickets);
});

// @desc Get a single support ticket by ID
// @route GET /api/support-tickets/:id
// @access Private
const getTicketById = asyncHandler(async (req, res) => {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Support ticket not found');
    }

    if (ticket.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to view this ticket');
    }

    res.json(ticket);
});

module.exports = { createTicket, getClientTickets, getTicketById };
