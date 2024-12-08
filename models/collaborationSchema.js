// models/collaborationSchema.js
const mongoose = require('mongoose');

const MilestoneSchema = mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'overdue'], 
    default: 'pending' 
  },
});

const CollaborationSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  attachments: [
    {
      type: String, // Store file URLs or paths
    },
  ],
  milestones: [MilestoneSchema], // Added milestones
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Collaboration', CollaborationSchema);
