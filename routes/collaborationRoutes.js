// routes/collaborationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createCollaboration,
  addMilestone,
  updateMilestoneStatus,
  getMilestones,
} = require('../controllers/collaborationController');

// Create a new collaboration
router.post('/', protect, createCollaboration);

// Add a milestone to a collaboration
router.post('/:collaborationId/milestones', protect, addMilestone);

// Update milestone status
router.put('/:collaborationId/milestones/:milestoneId', protect, updateMilestoneStatus);

// Retrieve milestones for a collaboration
router.get('/:collaborationId/milestones', protect, getMilestones);

module.exports = router;
