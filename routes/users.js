const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile with stats
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Get user's product stats
    const [totalListings, activeListings, soldListings] = await Promise.all([
      Product.countDocuments({ owner: req.user._id }),
      Product.countDocuments({ owner: req.user._id, isAvailable: true }),
      Product.countDocuments({ owner: req.user._id, isAvailable: false })
    ]);

    res.json({
      user,
      stats: {
        totalListings,
        activeListings,
        soldListings
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   GET /api/users/:id/public
// @desc    Get public user profile
// @access  Public
router.get('/:id/public', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name studentId avatar createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's active listings count
    const activeListings = await Product.countDocuments({ 
      owner: req.params.id, 
      isAvailable: true 
    });

    res.json({
      user,
      stats: {
        activeListings,
        memberSince: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get public profile error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
});

// @route   GET /api/users/:id/products
// @desc    Get user's public product listings
// @access  Public
router.get('/:id/products', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, totalProducts] = await Promise.all([
      Product.find({ 
        owner: req.params.id, 
        isAvailable: true 
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'name studentId'),
      Product.countDocuments({ 
        owner: req.params.id, 
        isAvailable: true 
      })
    ]);

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      totalProducts
    });

  } catch (error) {
    console.error('Get user products error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error while fetching user products' });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id);

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
});

module.exports = router;
