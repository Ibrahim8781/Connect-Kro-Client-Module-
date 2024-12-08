const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');
const Gig = require('../models/gigSchema');

// @desc Get all saved gigs for the client
// @route GET /api/clients/saved-gigs
// @access Private
const getSavedGigs = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('savedGigs');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user.savedGigs);
});

// @desc Save a new gig to the client's wishlist
// @route POST /api/clients/saved-gigs
// @access Private
const saveGig = asyncHandler(async (req, res) => {
    const { gigId } = req.body;
    const gig = await Gig.findById(gigId);
    if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
    }

    const user = await User.findById(req.user.id);
    if (user.savedGigs.includes(gig._id)) {
        res.status(400);
        throw new Error('Gig already saved');
    }

    user.savedGigs.push(gig._id);
    await user.save();
    res.status(201).json({ message: 'Gig saved successfully' });
});

// @desc Remove a gig from the client's wishlist
// @route DELETE /api/clients/saved-gigs/:id
// @access Private
const removeSavedGig = asyncHandler(async (req, res) => {
    const { id: gigId } = req.params;
    const user = await User.findById(req.user.id);
    user.savedGigs = user.savedGigs.filter(
        (savedGigId) => savedGigId.toString() !== gigId
    );
    await user.save();
    res.status(200).json({ message: 'Gig removed from saved list' });
});

module.exports = { getSavedGigs, saveGig, removeSavedGig };
