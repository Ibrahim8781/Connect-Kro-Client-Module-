const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createTicket,
    getClientTickets,
    getTicketById,
} = require('../controllers/supportTicketController');

// Client
router.post('/', protect, createTicket);
router.get('/', protect, getClientTickets);
router.get('/:id', protect, getTicketById);

module.exports = router;
