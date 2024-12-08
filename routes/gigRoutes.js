const express = require('express');
const router = express.Router();
const { getAllGigs, getGigById } = require('../controllers/gigController');

// Public
router.get('/', getAllGigs); // Get all gigs
router.get('/:id', getGigById); // Get a single gig by ID

module.exports = router;
