const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isAvailable: true };

    // Filter by category
    if (category && category !== '') {
      query.category = category.toLowerCase();
    }

    // Search by name or description
    if (search && search !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving products'
    });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (page - 1) * limit;

    const products = await Product.find({
      category: category.toLowerCase(),
      isAvailable: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments({
      category: category.toLowerCase(),
      isAvailable: true
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // Increment views
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving product'
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Authenticated users only)
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, category, price, condition } = req.body;

    // Validation
    if (!name || !description || !category || price === undefined || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate price
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }

    // Create product with current user as seller
    const product = await Product.create({
      name,
      description,
      category: category.toLowerCase(),
      price,
      condition: condition.toLowerCase(),
      seller: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      data: product
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
});

// @route   GET /api/products/user/my-products
// @desc    Get current user's products
// @access  Private
router.get('/user/my-products', protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving your products'
    });
  }
});

module.exports = router;
