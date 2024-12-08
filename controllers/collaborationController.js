// controllers/collaborationController.js
const Collaboration = require('../models/collaborationSchema');

// Create a new collaboration
const createCollaboration = async (req, res) => {
  try {
    const { orderId, message, attachments } = req.body;

    if (!orderId || !message) {
      return res.status(400).json({ message: 'Order ID and message are required.' });
    }

    const collaboration = await Collaboration.create({
      orderId,
      user: req.user.id,
      message,
      attachments,
    });

    res.status(201).json(collaboration);
  } catch (error) {
    console.error('Error creating collaboration:', error);
    res.status(500).json({ message: 'Failed to create collaboration', error: error.message });
  }
};

// Add a milestone to a collaboration
const addMilestone = async (req, res) => {
  try {
    const { collaborationId } = req.params;
    const { title, dueDate } = req.body;

    const collaboration = await Collaboration.findById(collaborationId);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found.' });
    }

    const milestone = { title, dueDate, status: 'pending' };
    collaboration.milestones.push(milestone);
    await collaboration.save();

    res.status(201).json(milestone);
  } catch (error) {
    console.error('Error adding milestone:', error);
    res.status(500).json({ message: 'Failed to add milestone', error: error.message });
  }
};

// Update milestone status
const updateMilestoneStatus = async (req, res) => {
  try {
    const { collaborationId, milestoneId } = req.params;
    const { status } = req.body;

    const collaboration = await Collaboration.findById(collaborationId);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found.' });
    }

    const milestone = collaboration.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    milestone.status = status;
    await collaboration.save();

    res.status(200).json(milestone);
  } catch (error) {
    console.error('Error updating milestone status:', error);
    res.status(500).json({ message: 'Failed to update milestone status', error: error.message });
  }
};

// Retrieve milestones for a collaboration
const getMilestones = async (req, res) => {
  try {
    const { collaborationId } = req.params;

    const collaboration = await Collaboration.findById(collaborationId);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found.' });
    }

    res.status(200).json(collaboration.milestones);
  } catch (error) {
    console.error('Error retrieving milestones:', error);
    res.status(500).json({ message: 'Failed to retrieve milestones', error: error.message });
  }
};

module.exports = {
  createCollaboration,
  addMilestone,
  updateMilestoneStatus,
  getMilestones,
};
