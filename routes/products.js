const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product listing
// @access  Private
router.post('/', auth, upload.array('images', 5), [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10-1000 characters'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn([
    'Books & Stationery',
    'Electronics',
    'Laptops & Computers',
    'Mobile Phones',
    'Furniture',
    'Sports & Fitness',
    'Fashion & Accessories',
    'Other'
  ]).withMessage('Invalid category'),
  body('condition').isIn(['New', 'Like New', 'Good', 'Fair', 'Poor']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    console.log('POST /api/products - User:', req.user);
    console.log('POST /api/products - Files:', req.files);
    console.log('POST /api/products - Body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, category, condition, tags } = req.body;

    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      console.log('No images uploaded');
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Process image paths
    const images = req.files.map(file => file.path.replace(/\\/g, '/'));

    // Process tags
    let productTags = [];
    if (tags) {
      productTags = typeof tags === 'string' ? 
        tags.split(',').map(tag => tag.trim()) : 
        Array.isArray(tags) ? tags : [];
    }

    // Create product
    console.log('Creating product with user data:', {
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone
    });
    
    const product = new Product({
      title,
      description,
      price: parseFloat(price),
      category,
      condition,
      images,
      tags: productTags,
      owner: req.user._id,
      ownerName: req.user.name,
      ownerPhone: req.user.phone,
      ownerEmail: req.user.email
    });

    await product.save();

    // Populate owner details for response
    await product.populate('owner', 'name email phone studentId');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// @route   GET /api/products
// @desc    Get all products with search and filter functionality
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/products - Query params:', req.query);
    
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build query object
    let query = { isAvailable: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Condition filter
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sort = {};
    if (search && !sortBy.includes('price') && !sortBy.includes('createdAt')) {
      sort = { score: { $meta: 'textScore' } };
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('MongoDB Query:', query);
    console.log('Sort:', sort);
    console.log('Skip:', skip, 'Limit:', parseInt(limit));
    
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'name studentId'),
      Product.countDocuments(query)
    ]);

    console.log('Found products:', products.length);
    console.log('Total products in DB:', totalProducts);

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      totalProducts,
      hasNext: skip + products.length < totalProducts,
      hasPrev: parseInt(page) > 1
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// @route   GET /api/products/categories/stats
// @desc    Get product count by category
// @access  Public
router.get('/categories/stats', async (req, res) => {
  try {
    console.log('GET /api/products/categories/stats - Getting category statistics');
    
    const categoryStats = await Product.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('Category stats:', categoryStats);

    res.json({
      categories: categoryStats,
      totalProducts: categoryStats.reduce((total, cat) => total + cat.count, 0)
    });

  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({ message: 'Server error while fetching category statistics' });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('owner', 'name email phone studentId avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json(product);

  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (owner only)
// @access  Private
router.put('/:id', auth, upload.array('images', 5), [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('price').optional().isNumeric().isFloat({ min: 0 }),
  body('category').optional().isIn([
    'Books & Stationery',
    'Electronics',
    'Laptops & Computers',
    'Mobile Phones',
    'Furniture',
    'Sports & Fitness',
    'Fashion & Accessories',
    'Other'
  ]),
  body('condition').optional().isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Update fields
    const { title, description, price, category, condition, tags, isAvailable } = req.body;
    
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (condition) product.condition = condition;
    if (typeof isAvailable !== 'undefined') product.isAvailable = isAvailable;

    // Update tags
    if (tags) {
      product.tags = typeof tags === 'string' ? 
        tags.split(',').map(tag => tag.trim()) : 
        Array.isArray(tags) ? tags : [];
    }

    // Update images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path.replace(/\\/g, '/'));
      product.images = newImages;
    }

    await product.save();
    await product.populate('owner', 'name email phone studentId');

    res.json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (owner only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// @route   GET /api/products/my/listings
// @desc    Get current user's product listings
// @access  Private
router.get('/my/listings', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;

    let query = { owner: req.user._id };
    
    if (status === 'available') {
      query.isAvailable = true;
    } else if (status === 'sold') {
      query.isAvailable = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      totalProducts
    });

  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ message: 'Server error while fetching your listings' });
  }
});

module.exports = router;
