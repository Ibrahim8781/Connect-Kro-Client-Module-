const mongoose = require('mongoose');

const CategorySchema =  mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subcategories: [{ type: String }],
  });
  
  module.exports = mongoose.model('Category', CategorySchema);
  