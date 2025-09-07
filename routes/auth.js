const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user with campus email verification
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('studentId').trim().isLength({ min: 1 }).withMessage('Student ID is required'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, studentId, phone } = req.body;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [{ email }, { studentId }] 
    });

    if (user) {
      return res.status(400).json({ 
        message: 'User already exists with this email or student ID' 
      });
    }

    // Validate campus email domain
    if (!email.endsWith('@smit.smu.edu.in')) {
      return res.status(400).json({ 
        message: 'Please use your campus email (@smit.smu.edu.in)' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      studentId,
      phone,
      verificationToken,
      isVerified: true // Auto-verify for testing purposes
    });

    await user.save();
    
    // Double-check verification status
    console.log('User created with verification status:', user.isVerified);

    // Try to send verification email, but don't fail if email service is not configured
    try {
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'SMIT Campus Marketplace - Verify Your Account',
        html: `
          <h2>Welcome to SMIT Campus Marketplace!</h2>
          <p>Hello ${name},</p>
          <p>Please click the link below to verify your account:</p>
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Account</a>
          <p>If you didn't create this account, please ignore this email.</p>
          <p>Best regards,<br>SMIT Campus Marketplace Team</p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully');
    } catch (emailError) {
      console.log('Email service not configured, account auto-verified for testing');
    }

    res.status(201).json({
      message: 'User registered successfully. Account has been verified for testing.',
      userId: user._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   GET /api/auth/verify/:token
// @desc    Verify user email
// @access  Public
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully. You can now login.' });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Login attempt for user:', email, 'isVerified:', user.isVerified);

    // Check if account is verified (temporarily disabled for testing)
    // if (!user.isVerified) {
    //   return res.status(400).json({ 
    //     message: 'Please verify your email before logging in' 
    //   });
    // }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      userId: user._id,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        phone: user.phone,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        studentId: req.user.studentId,
        phone: req.user.phone,
        avatar: req.user.avatar
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
