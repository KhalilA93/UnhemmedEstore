const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxLength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxLength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
  dateOfBirth: {
    type: Date
  },
  avatar: {
    url: String,
    alt: String
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'moderator'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  addresses: [{
    type: {
      type: String,
      enum: ['billing', 'shipping', 'both'],
      default: 'both'
    },
    firstName: String,
    lastName: String,
    company: String,
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'US'
    },
    phone: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  paymentMethods: [{
    type: {
      type: String,
      enum: ['card', 'paypal', 'bank'],
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    // For cards (store securely - use payment processor tokens)
    last4: String,
    brand: String,
    expiryMonth: Number,
    expiryYear: Number,
    cardholderName: String,
    // For PayPal
    paypalEmail: String,
    // For bank transfers
    bankName: String,
    accountLast4: String,
    // Payment processor data
    stripePaymentMethodId: String,
    paypalPaymentMethodId: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    newsletter: {
      type: Boolean,
      default: false
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      orderUpdates: {
        type: Boolean,
        default: true
      },
      promotions: {
        type: Boolean,
        default: false
      }
    },
    currency: {
      type: String,
      default: 'USD'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  wishlist: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: String,
    color: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  recentlyViewed: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Customer analytics
  analytics: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    favoriteCategories: [String],
    lifetimeValue: {
      type: Number,
      default: 0
    }
  },
  // Account security
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  phoneVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for cart total items
userSchema.virtual('cartItemsCount').get(function() {
  return this.cart.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for cart total value
userSchema.virtual('cartTotalValue').get(function() {
  return this.cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
});

// Virtual for wishlist count
userSchema.virtual('wishlistCount').get(function() {
  return this.wishlist.length;
});

// Virtual for account locked status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for better performance
// Note: email index is already created by unique: true in schema
userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'cart.product': 1 });
userSchema.index({ 'wishlist.product': 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ 'analytics.totalSpent': -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to ensure only one default address per type
userSchema.methods.setDefaultAddress = function(addressId, type) {
  this.addresses.forEach(addr => {
    if (addr.type === type || addr.type === 'both') {
      addr.isDefault = addr._id.toString() === addressId.toString();
    }
  });
};

// Method to set default payment method
userSchema.methods.setDefaultPaymentMethod = function(paymentMethodId) {
  this.paymentMethods.forEach(pm => {
    pm.isDefault = pm._id.toString() === paymentMethodId.toString();
  });
};

// Method to add product to recently viewed
userSchema.methods.addToRecentlyViewed = function(productId) {
  // Remove if already exists
  this.recentlyViewed = this.recentlyViewed.filter(
    item => item.product.toString() !== productId.toString()
  );
  
  // Add to beginning
  this.recentlyViewed.unshift({
    product: productId,
    viewedAt: new Date()
  });
  
  // Keep only last 20 items
  this.recentlyViewed = this.recentlyViewed.slice(0, 20);
};

// Method to update analytics after purchase
userSchema.methods.updateAnalytics = function(orderTotal, categories) {
  this.analytics.totalOrders += 1;
  this.analytics.totalSpent += orderTotal;
  this.analytics.lifetimeValue += orderTotal;
  this.analytics.averageOrderValue = this.analytics.totalSpent / this.analytics.totalOrders;
  
  // Update favorite categories
  if (categories && categories.length > 0) {
    categories.forEach(category => {
      if (!this.analytics.favoriteCategories.includes(category)) {
        this.analytics.favoriteCategories.push(category);
      }
    });
  }
};

// Method to handle login attempts and account locking
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        lockUntil: 1
      },
      $set: {
        loginAttempts: 1
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    },
    $set: {
      lastLogin: new Date()
    }
  });
};

module.exports = mongoose.model('User', userSchema);
