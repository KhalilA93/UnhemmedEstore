const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');

// @route   POST /api/orders
router.post('/', protect, createOrder);

// @route   GET /api/orders
router.get('/', protect, getOrders);

// @route   GET /api/orders/:id
router.get('/:id', protect, getOrder);

// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, updateOrderStatus);

// @route   DELETE /api/orders/:id
router.delete('/:id', protect, cancelOrder);

module.exports = router;
