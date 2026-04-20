const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const StockPrediction = require('../models/StockPrediction');
const IPO = require('../models/IPO');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// --- USER & PORTFOLIO ROUTES ---

// Create User (Mock Auth)
router.post('/users', async (req, res) => {
  try {
    const { username, email } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, email, watchlist: [] });
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User and Watchlist
router.get('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to Watchlist
router.post('/users/:username/watchlist', async (req, res) => {
  try {
    const { ticker } = req.body;
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (!user.watchlist.includes(ticker)) {
      user.watchlist.push(ticker);
      await user.save();
    }
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from Watchlist
router.delete('/users/:username/watchlist/:ticker', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.watchlist = user.watchlist.filter(t => t !== req.params.ticker);
    await user.save();
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ML PREDICTION ROUTES ---

router.get('/stocks/predict/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    
    // Check cache first (e.g., within the last 12 hours)
    const cachedData = await StockPrediction.findOne({ ticker: ticker.toUpperCase() });
    if (cachedData && (new Date() - cachedData.lastUpdated) < 12 * 60 * 60 * 1000) {
      return res.json({ source: 'cache', data: cachedData });
    }

    // Call Python ML Service
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/predict/${ticker}`);
    
    if (mlResponse.data && mlResponse.data.status === 'success') {
      const predictions = mlResponse.data.predictions;
      
      // Update or create cache
      const updatedCache = await StockPrediction.findOneAndUpdate(
        { ticker: ticker.toUpperCase() },
        { 
          ticker: ticker.toUpperCase(), 
          predictions: predictions, 
          lastUpdated: new Date() 
        },
        { upsert: true, new: true }
      );
      
      return res.json({ source: 'ml-service', data: updatedCache });
    } else {
      return res.status(500).json({ error: 'ML Service failed to process request' });
    }

  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json({ error: err.response.data });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// --- IPO CALENDAR ROUTES ---

// Get IPOs (Mocked)
router.get('/ipos', async (req, res) => {
  try {
    // If empty, let's mock some initial data
    let ipos = await IPO.find().sort({ expectedDate: 1 });
    
    if (ipos.length === 0) {
      const mockData = [
        { companyName: 'Stripe', symbol: 'STRIP', expectedDate: new Date(new Date().setDate(new Date().getDate() + 15)), priceRange: '$40.00 - $45.00', sharesOffered: 50000000 },
        { companyName: 'Databricks', symbol: 'DBRX', expectedDate: new Date(new Date().setDate(new Date().getDate() + 30)), priceRange: '$60.00 - $68.00', sharesOffered: 80000000 },
        { companyName: 'Discord', symbol: 'DSCD', expectedDate: new Date(new Date().setDate(new Date().getDate() + 45)), priceRange: '$35.00 - $38.00', sharesOffered: 45000000 }
      ];
      ipos = await IPO.insertMany(mockData);
    }
    
    res.json(ipos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
