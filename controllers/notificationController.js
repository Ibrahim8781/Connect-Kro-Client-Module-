const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationSchema');

// @desc Fetch all notifications for the logged-in user with pagination
// @route GET /api/notifications
// @access Private
const getNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 notifications per page
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: req.user.id })
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit);

    const total = await Notification.countDocuments({ user: req.user.id });

    res.json({
        notifications,
        total,
        page,
        pages: Math.ceil(total / limit),
    });
});

// @desc Mark a notification as read
// @route PUT /api/notifications/:id
// @access Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    if (notification.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to update this notification');
    }

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
});

// @desc Mark all notifications as read
// @route PUT /api/notifications/mark-all
// @access Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user.id, read: false }, // Only unread notifications
        { $set: { read: true } }
    );

    res.json({ message: 'All notifications marked as read' });
});

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};
