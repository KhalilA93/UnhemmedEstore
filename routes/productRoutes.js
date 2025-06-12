const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getCategories,
  searchProducts
} = require('../controllers/productController');

// @route   GET /api/products
router.get('/', getProducts);

// @route   GET /api/products/featured
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/categories
router.get('/categories', getCategories);

// @route   GET /api/products/search
router.get('/search', searchProducts);

// @route   GET /api/products/:id
router.get('/:id', getProduct);

module.exports = router;
