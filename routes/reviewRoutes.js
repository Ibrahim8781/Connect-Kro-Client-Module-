// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { addReview, editReview, getClientReviews } = require('../controllers/reviewController');

// Client
router.post('/', protect, roleMiddleware(['client']), addReview); // Add a review
router.put('/:id', protect, roleMiddleware(['client']), editReview); // Edit a review
router.get('/', protect, roleMiddleware(['client']), getClientReviews); // Get all reviews by a client

module.exports = router;
