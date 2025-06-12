const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  addToCart,
  updateCartItem,
  removeFromCart
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

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
