const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Constants for validation and configuration
const USER_CONSTANTS = {
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  BCRYPT_SALT_ROUNDS: 12,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_TIME: 2 * 60 * 60 * 1000, // 2 hours
  MAX_RECENTLY_VIEWED: 20
};

const USER_ROLES = ['customer', 'admin', 'moderator'];
const USER_STATUSES = ['active', 'inactive', 'suspended'];
const ADDRESS_TYPES = ['billing', 'shipping', 'both'];
const PAYMENT_TYPES = ['card', 'paypal', 'bank'];

// Address subdocument schema
const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ADDRESS_TYPES,
    default: 'both'
  },
  firstName: {
    type: String,
    required: [true, 'First name is required for address'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required for address'],
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required'],
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    default: 'US',
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

// Payment method subdocument schema
const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: PAYMENT_TYPES,
    required: [true, 'Payment method type is required']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  // Card-specific fields
  last4: String,
  brand: String,
  expiryMonth: Number,
  expiryYear: Number,
  cardholderName: String,
  // PayPal-specific fields
  paypalEmail: String,
  // Bank-specific fields
  bankName: String,
  accountLast4: String,
  // Payment processor IDs
  stripePaymentMethodId: String,
  paypalPaymentMethodId: String,
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Cart item subdocument schema
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required for cart item']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  size: String,
  color: String
}, {
  timestamps: true
});

// Wishlist item subdocument schema
const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required for wishlist item']
  },
  notes: String
}, {
  timestamps: true
});

// Recently viewed subdocument schema
const recentlyViewedSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required for recently viewed']
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

// Main user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxLength: [USER_CONSTANTS.NAME_MAX_LENGTH, `First name cannot exceed ${USER_CONSTANTS.NAME_MAX_LENGTH} characters`]
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxLength: [USER_CONSTANTS.NAME_MAX_LENGTH, `Last name cannot exceed ${USER_CONSTANTS.NAME_MAX_LENGTH} characters`]
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [USER_CONSTANTS.PASSWORD_MIN_LENGTH, `Password must be at least ${USER_CONSTANTS.PASSWORD_MIN_LENGTH} characters`],
    select: false
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number'],
    trim: true
  },
  dateOfBirth: Date,
  avatar: {
    url: String,
    alt: String
  },
  role: {
    type: String,
    enum: USER_ROLES,
    default: 'customer',
    index: true
  },
  status: {
    type: String,
    enum: USER_STATUSES,
    default: 'active',
    index: true
  },
  
  // Nested schemas
  addresses: [addressSchema],
  paymentMethods: [paymentMethodSchema],
  cart: [cartItemSchema],
  wishlist: [wishlistItemSchema],
  recentlyViewed: [recentlyViewedSchema],
  
  // User preferences
  preferences: {
    newsletter: {
      type: Boolean,
      default: false
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false }
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
  
  // Analytics and metrics
  analytics: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    favoriteCategories: [String],
    lifetimeValue: { type: Number, default: 0 }
  },
  
  // Security fields
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, select: false },
  phoneVerificationToken: { type: String, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, select: false }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      // Remove sensitive fields from JSON output
      const sensitiveFields = [
        'password', 'emailVerificationToken', 'passwordResetToken',
        'passwordResetExpires', 'twoFactorSecret', 'phoneVerificationToken'
      ];
      
      sensitiveFields.forEach(field => delete ret[field]);
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'cart.product': 1 });
userSchema.index({ 'wishlist.product': 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ 'analytics.totalSpent': -1 });

// Virtual properties
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('cartItemsCount').get(function() {
  return this.cart.reduce((total, item) => total + item.quantity, 0);
});

userSchema.virtual('cartTotalValue').get(function() {
  return this.cart.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);
});

userSchema.virtual('wishlistCount').get(function() {
  return this.wishlist.length;
});

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  try {
    // Hash password if modified
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(USER_CONSTANTS.BCRYPT_SALT_ROUNDS);
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    // Ensure only one default address per type
    if (this.isModified('addresses')) {
      this.ensureSingleDefaultAddress();
    }
    
    // Ensure only one default payment method
    if (this.isModified('paymentMethods')) {
      this.ensureSingleDefaultPaymentMethod();
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods using arrow functions where appropriate
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.ensureSingleDefaultAddress = function() {
  ADDRESS_TYPES.forEach(type => {
    const defaultAddresses = this.addresses.filter(addr => 
      addr.isDefault && (addr.type === type || addr.type === 'both')
    );
    
    if (defaultAddresses.length > 1) {
      // Keep only the first one as default
      defaultAddresses.slice(1).forEach(addr => {
        addr.isDefault = false;
      });
    }
  });
};

userSchema.methods.ensureSingleDefaultPaymentMethod = function() {
  const defaultMethods = this.paymentMethods.filter(pm => pm.isDefault);
  
  if (defaultMethods.length > 1) {
    // Keep only the first one as default
    defaultMethods.slice(1).forEach(pm => {
      pm.isDefault = false;
    });
  }
};

userSchema.methods.setDefaultAddress = function(addressId, type) {
  this.addresses.forEach(addr => {
    if (addr.type === type || addr.type === 'both') {
      addr.isDefault = addr._id.toString() === addressId.toString();
    }
  });
  return this.save();
};

userSchema.methods.setDefaultPaymentMethod = function(paymentMethodId) {
  this.paymentMethods.forEach(pm => {
    pm.isDefault = pm._id.toString() === paymentMethodId.toString();
  });
  return this.save();
};

userSchema.methods.addToRecentlyViewed = function(productId) {
  // Remove if already exists (using filter for immutability)
  this.recentlyViewed = this.recentlyViewed.filter(
    item => item.product.toString() !== productId.toString()
  );
  
  // Add to beginning
  this.recentlyViewed.unshift({
    product: productId,
    viewedAt: new Date()
  });
  
  // Keep only recent items
  if (this.recentlyViewed.length > USER_CONSTANTS.MAX_RECENTLY_VIEWED) {
    this.recentlyViewed = this.recentlyViewed.slice(0, USER_CONSTANTS.MAX_RECENTLY_VIEWED);
  }
  
  return this.save();
};

userSchema.methods.updateAnalytics = function(orderTotal, categories = []) {
  this.analytics.totalOrders += 1;
  this.analytics.totalSpent += orderTotal;
  this.analytics.lifetimeValue += orderTotal;
  this.analytics.averageOrderValue = this.analytics.totalSpent / this.analytics.totalOrders;
  
  // Update favorite categories (using Set for uniqueness)
  const currentCategories = new Set(this.analytics.favoriteCategories);
  categories.forEach(category => currentCategories.add(category));
  this.analytics.favoriteCategories = Array.from(currentCategories);
  
  return this.save();
};

userSchema.methods.handleFailedLogin = async function() {
  // Reset if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after max attempts
  const attemptsExceeded = this.loginAttempts + 1 >= USER_CONSTANTS.MAX_LOGIN_ATTEMPTS;
  if (attemptsExceeded && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + USER_CONSTANTS.LOCK_TIME
    };
  }
  
  return this.updateOne(updates);
};

userSchema.methods.handleSuccessfulLogin = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

module.exports = mongoose.model('User', userSchema);
