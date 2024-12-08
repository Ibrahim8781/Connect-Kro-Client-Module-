const Gig = require('../models/gigSchema');
const User = require('../models/userSchema');

/**
 * @desc Get all gigs
 * @route GET /api/gigs
 * @access Public
 */
const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().populate('createdBy', 'name bio skills');
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gigs', error: error.message });
  }
};

/**
 * @desc Get a single gig by ID
 * @route GET /api/gigs/:id
 * @access Public
 */
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('createdBy', 'name bio skills');
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the gig', error: error.message });
  }
};

/**
 * @desc Save a gig to the client's wishlist
 * @route POST /api/gigs/save/:gigId
 * @access Private (Client role)
 */
const saveGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.id;

    // Ensure gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Add gig to the client's saved gigs
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedGigs: gigId } },
      { new: true }
    );

    res.status(200).json({ message: 'Gig saved successfully', savedGigs: user.savedGigs });
  } catch (error) {
    res.status(500).json({ message: 'Error saving gig', error: error.message });
  }
};

/**
 * @desc Remove a gig from the client's wishlist
 * @route DELETE /api/gigs/save/:gigId
 * @access Private (Client role)
 */
const removeSavedGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.id;

    // Remove gig from the client's saved gigs
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedGigs: gigId } },
      { new: true }
    );

    res.status(200).json({ message: 'Gig removed successfully', savedGigs: user.savedGigs });
  } catch (error) {
    res.status(500).json({ message: 'Error removing gig', error: error.message });
  }
};

module.exports = {
  getAllGigs,
  getGigById,
  saveGig,
  removeSavedGig,
};
