const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Email transporter setup
const createTransporter = () => {
  // For development, create a test account if no email is configured
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'khalilatkins420@gmail.com') {
    console.log('⚠️  Email not configured. Email features will be simulated.');
    return null;
  }
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Simulate email sending for development
const simulateEmail = (to, subject, html) => {
  console.log('📧 EMAIL SIMULATION:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Content:', html);
  console.log('🔗 In production, this would be sent via email service');
  return Promise.resolve({ messageId: 'simulated-' + Date.now() });
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, preferences } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      preferences: preferences || {},
      emailVerificationToken
    });

    if (user) {
      // Send welcome/verification email
      try {
        const transporter = createTransporter();
        if (transporter) {
          const verifyUrl = `${req.protocol}://${req.get('host')}/verify-email?token=${emailVerificationToken}`;
          
          const message = `
            <h1>Welcome to Unhemmed!</h1>
            <p>Thank you for creating an account with us, ${firstName}!</p>
            <p>To complete your registration, please verify your email address:</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px;">Verify Email</a>
            <p>Once verified, you'll have access to:</p>
            <ul>
              <li>Personalized product recommendations</li>
              <li>Order tracking and history</li>
              <li>Saved addresses and payment methods</li>
              <li>Wishlist and favorites</li>
            </ul>
            <p>Welcome to the Unhemmed family!</p>
          `;

          await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@unhemmed.com',
            to: user.email,
            subject: 'Welcome to Unhemmed - Verify Your Email',
            html: message
          });
        } else {
          await simulateEmail(user.email, 'Welcome to Unhemmed', 'Welcome and verification email');
        }
      } catch (emailError) {
        console.error('Welcome email error:', emailError);
        // Don't fail registration if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email and include password for comparison
    const user = await User.findOne({ email })
      .select('+password')
      .populate('cart.product', 'name price images sizes colors')
      .populate('wishlist.product', 'name price images');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      // If user exists, increment login attempts
      if (user) {
        await user.handleFailedLogin();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Reset login attempts on successful login and update last login
    await user.handleSuccessfulLogin();

    // Migrate guest cart if exists (will implement in frontend)
    // For now, just return user data

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        preferences: user.preferences,
        cart: user.cart,
        wishlist: user.wishlist,
        analytics: user.analytics,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('cart.product', 'name price images sizes colors')
      .populate('wishlist.product', 'name price images')
      .populate('recentlyViewed.product', 'name price images');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    const { firstName, lastName, phone, dateOfBirth, preferences } = req.body;
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Add to cart
// @route   POST /api/auth/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product exists in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity: parseInt(quantity)
      });
    }

    await user.save();
    await user.populate('cart.product', 'name price images');

    res.json({
      success: true,
      data: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart'
    });
  }
};

// @desc    Update cart item
// @route   PUT /api/auth/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(req.params.itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    if (quantity <= 0) {
      cartItem.remove();
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();
    await user.populate('cart.product', 'name price images');

    res.json({
      success: true,
      data: user.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
};

// @desc    Remove from cart
// @route   DELETE /api/auth/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(req.params.itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    cartItem.remove();
    await user.save();
    await user.populate('cart.product', 'name price images');

    res.json({
      success: true,
      data: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
};

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.passwordResetToken = resetPasswordToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>You have requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      const transporter = createTransporter();      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'khalilatkins420@gmail.com',
        to: user.email,
        subject: 'Password Reset Request',
        html: message
      });

      res.json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      console.error('Email error:', error);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetPasswordToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Send email verification
// @route   POST /api/auth/send-verification
// @access  Private
const sendEmailVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    await user.save();

    // Create verification url
    const verifyUrl = `${req.protocol}://${req.get('host')}/verify-email?token=${verificationToken}`;

    const message = `
      <h1>Email Verification</h1>
      <p>Thank you for registering with Unhemmed! Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px;">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
    `;

    try {
      const transporter = createTransporter();      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'khalilatkins420@gmail.com',
        to: user.email,
        subject: 'Verify Your Email Address',
        html: message
      });

      res.json({
        success: true,
        message: 'Verification email sent'
      });
    } catch (error) {
      console.error('Email error:', error);
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add address to user profile
// @route   POST /api/auth/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const addressData = req.body;

    // If this is the first address or marked as default, make it default
    if (user.addresses.length === 0 || addressData.isDefault) {
      user.addresses.forEach(addr => {
        if (addr.type === addressData.type || addr.type === 'both') {
          addr.isDefault = false;
        }
      });
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding address'
    });
  }
};

// @desc    Update address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Update address fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        address[key] = req.body[key];
      }
    });

    // Handle default address logic
    if (req.body.isDefault) {
      user.setDefaultAddress(address._id, address.type);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating address'
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    address.remove();
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting address'
    });
  }
};

// @desc    Add to wishlist
// @route   POST /api/auth/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId, notes } = req.body;
    const user = await User.findById(req.user.id);

    // Check if product already in wishlist
    const existingItem = user.wishlist.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push({
      product: productId,
      notes,
      addedAt: new Date()
    });

    await user.save();
    await user.populate('wishlist.product', 'name price images');

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to wishlist'
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/auth/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.wishlist = user.wishlist.filter(
      item => item.product.toString() !== req.params.productId
    );

    await user.save();
    await user.populate('wishlist.product', 'name price images');

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from wishlist'
    });
  }
};

// @desc    Add product to recently viewed
// @route   POST /api/auth/recently-viewed
// @access  Private
const addToRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    user.addToRecentlyViewed(productId);
    await user.save();

    res.json({
      success: true,
      message: 'Product added to recently viewed'
    });
  } catch (error) {
    console.error('Add to recently viewed error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  addToCart,
  updateCartItem,
  removeFromCart,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  addToRecentlyViewed
};
