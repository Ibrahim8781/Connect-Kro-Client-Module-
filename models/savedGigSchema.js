const mongoose = require('mongoose');

const savedGigSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    gigId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gig',
    },
    listName: {
        type: String,
        default: 'General', // Default category
    },
});

module.exports = mongoose.model('SavedGig', savedGigSchema);

