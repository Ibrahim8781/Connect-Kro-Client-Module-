const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
    getSavedGigsByList,
    createCustomList,
    renameCustomList,
    deleteCustomList,
    saveGigToList,
    removeGigFromList,
} = require('../controllers/savedGigController');

// Fetch gigs by list name
router.get('/:listName', protect, roleMiddleware(['client']), getSavedGigsByList);

// Create a new custom list
router.post('/lists', protect, roleMiddleware(['client']), createCustomList);

// Rename an existing custom list
router.put('/lists/:oldName', protect, roleMiddleware(['client']), renameCustomList);

// Delete a custom list
router.delete('/lists/:listName', protect, roleMiddleware(['client']), deleteCustomList);

// Save a gig to a custom list
router.post('/lists/:listName', protect, roleMiddleware(['client']), saveGigToList);

// Remove a gig from a custom list
router.delete('/:id', protect, roleMiddleware(['client']), removeGigFromList);

module.exports = router;
