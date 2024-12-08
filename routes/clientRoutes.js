const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
    getSavedGigs,
    saveGig,
    removeSavedGig,
} = require('../controllers/clientController');

// Client
router.get('/saved-gigs', protect, roleMiddleware(['client']), getSavedGigs); // Fetch saved gigs
router.post('/saved-gigs', protect, roleMiddleware(['client']), saveGig); // Save a new gig
router.delete('/saved-gigs/:id', protect, roleMiddleware(['client']), removeSavedGig); // Remove saved gig

module.exports = router;
