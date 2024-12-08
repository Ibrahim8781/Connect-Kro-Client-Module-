const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
} = require('../controllers/notificationController');

// Fetch notifications with pagination
router.get('/', protect, getNotifications);

// Mark a single notification as read
router.put('/:id', protect, markAsRead);

// Mark all notifications as read
router.put('/mark-all', protect, markAllAsRead);

module.exports = router;
