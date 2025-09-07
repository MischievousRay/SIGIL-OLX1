const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        // Validate SMIT email domain
        return email.endsWith('@smit.smu.edu.in');
      },
      message: 'Email must be from SMIT domain (@smit.smu.edu.in)'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ studentId: 1 });

module.exports = mongoose.model('User', userSchema);
