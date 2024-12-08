const SavedGig = require('../models/savedGigSchema');

// Fetch gigs by list name
const getSavedGigsByList = async (req, res) => {
    const { listName } = req.params;
    const userId = req.user.id;

    const gigs = await SavedGig.find({ userId, listName });
    res.status(200).json(gigs);
};

// Create a new custom list
const createCustomList = async (req, res) => {
    const { listName } = req.body;
    const userId = req.user.id;

    // Check if the list already exists
    const existing = await SavedGig.findOne({ userId, listName });
    if (existing) {
        return res.status(400).json({ message: 'List already exists.' });
    }

    // Save a placeholder gig to create the list
    const placeholder = new SavedGig({ userId, gigId: null, listName });
    await placeholder.save();

    res.status(201).json({ message: 'List created successfully.' });
};

// Rename an existing custom list
const renameCustomList = async (req, res) => {
    const { oldName } = req.params;
    const { newName } = req.body;
    const userId = req.user.id;

    const updated = await SavedGig.updateMany(
        { userId, listName: oldName },
        { $set: { listName: newName } }
    );

    if (updated.matchedCount === 0) {
        return res.status(404).json({ message: 'List not found.' });
    }

    res.status(200).json({ message: 'List renamed successfully.' });
};

// Delete a custom list
const deleteCustomList = async (req, res) => {
    const { listName } = req.params;
    const userId = req.user.id;

    const deleted = await SavedGig.deleteMany({ userId, listName });

    if (deleted.deletedCount === 0) {
        return res.status(404).json({ message: 'List not found.' });
    }

    res.status(200).json({ message: 'List deleted successfully.' });
};

// Save a gig to a custom list
const saveGigToList = async (req, res) => {
    const { listName } = req.params;
    const { gigId } = req.body;
    const userId = req.user.id;

    const gig = new SavedGig({ userId, gigId, listName });
    await gig.save();

    res.status(201).json({ message: 'Gig saved to list.' });
};

// Remove a gig from a custom list
const removeGigFromList = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const gig = await SavedGig.findOneAndDelete({ _id: id, userId });

    if (!gig) {
        return res.status(404).json({ message: 'Gig not found.' });
    }

    res.status(200).json({ message: 'Gig removed from list.' });
};

module.exports = {
    getSavedGigsByList,
    createCustomList,
    renameCustomList,
    deleteCustomList,
    saveGigToList,
    removeGigFromList,
};
