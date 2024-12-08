const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Transaction', TransactionSchema);
  