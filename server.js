const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB Connected');
  })
  .catch((err) => {
    console.error('✗ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

app.get('/browse.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'browse.html'));
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Authentication Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Product Routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || 'Validation error'
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Error handling for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
