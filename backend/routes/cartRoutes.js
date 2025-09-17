const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  moveToWishlist,
  applyCoupon
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// Validation middleware
const addToCartValidation = [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
  body('size').optional().isLength({ min: 1, max: 10 }).withMessage('Size must be 1-10 characters'),
  body('color').optional().isLength({ min: 1, max: 20 }).withMessage('Color must be 1-20 characters')
];

const updateCartValidation = [
  body('itemId').isMongoId().withMessage('Valid item ID is required'),
  body('quantity').isInt({ min: 0, max: 10 }).withMessage('Quantity must be between 0 and 10')
];

// @route   GET /api/cart
// @desc    Get user's cart with totals
// @access  Private
router.get('/', protect, getCart);

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', protect, addToCartValidation, handleValidationErrors, addToCart);

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put('/update', protect, updateCartValidation, handleValidationErrors, updateCartItem);

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', protect, removeFromCart);

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', protect, clearCart);

// @route   POST /api/cart/move-to-wishlist/:itemId
// @desc    Move cart item to wishlist
// @access  Private
router.post('/move-to-wishlist/:itemId', protect, moveToWishlist);

// @route   POST /api/cart/apply-coupon
// @desc    Apply coupon/discount code
// @access  Private
router.post('/apply-coupon', protect, [
  body('couponCode').trim().isLength({ min: 1, max: 20 }).withMessage('Coupon code is required')
], handleValidationErrors, applyCoupon);

module.exports = router;