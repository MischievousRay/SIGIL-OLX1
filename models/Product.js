const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Books & Stationery',
      'Electronics',
      'Laptops & Computers',
      'Mobile Phones',
      'Furniture',
      'Sports & Fitness',
      'Fashion & Accessories',
      'Other'
    ]
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  images: [{
    type: String,
    required: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerPhone: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
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
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Text index for search functionality
productSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Indexes for filtering
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ condition: 1 });
productSchema.index({ owner: 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
