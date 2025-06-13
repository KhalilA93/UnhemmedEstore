const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const {
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
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  }
});

// Validation middleware
const registerValidation = [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// @route   POST /api/auth/register
router.post('/register', authLimiter, registerValidation, handleValidationErrors, register);

// @route   POST /api/auth/login
router.post('/login', authLimiter, loginValidation, handleValidationErrors, login);

// @route   POST /api/auth/logout
router.post('/logout', logout);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, forgotPassword);

// @route   PUT /api/auth/reset-password/:resettoken
router.put('/reset-password/:resettoken', resetPassword);

// @route   POST /api/auth/send-verification
router.post('/send-verification', protect, sendEmailVerification);

// @route   GET /api/auth/verify-email/:token
router.get('/verify-email/:token', verifyEmail);

// @route   PUT /api/auth/change-password
router.put('/change-password', protect, changePassword);

// @route   GET /api/auth/profile
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

// @route   POST /api/auth/cart
router.post('/cart', protect, addToCart);

// @route   PUT /api/auth/cart/:itemId
router.put('/cart/:itemId', protect, updateCartItem);

// @route   DELETE /api/auth/cart/:itemId
router.delete('/cart/:itemId', protect, removeFromCart);

module.exports = router;
