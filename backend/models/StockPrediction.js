const mongoose = require('mongoose');

const StockPredictionSchema = new mongoose.Schema({
  ticker: { type: String, required: true, unique: true },
  lastUpdated: { type: Date, default: Date.now },
  predictions: [{
    date: { type: Date },
    predictedPrice: { type: Number },
    confidenceIntervalLow: { type: Number },
    confidenceIntervalHigh: { type: Number }
  }]
}, { timestamps: true });

module.exports = mongoose.model('StockPrediction', StockPredictionSchema);
