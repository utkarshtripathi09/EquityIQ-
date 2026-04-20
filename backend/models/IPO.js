const mongoose = require('mongoose');

const IPOSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  symbol: { type: String, required: true },
  expectedDate: { type: Date, required: true },
  priceRange: { type: String },
  sharesOffered: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('IPO', IPOSchema);
