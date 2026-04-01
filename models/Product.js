const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      minlength: [5, 'Product name must be at least 5 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['books', 'electronics', 'furniture', 'clothing', 'sports', 'other'],
      lowercase: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },
    condition: {
      type: String,
      required: [true, 'Please select condition'],
      enum: ['new', 'like-new', 'good', 'fair'],
      lowercase: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', category: 1 });

// Populate seller info when querying
productSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'seller',
    select: 'name email phone college'
  });
  next();
});

module.exports = mongoose.model('Product', productSchema);
