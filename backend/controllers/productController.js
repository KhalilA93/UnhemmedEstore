const Product = require('../models/Product');
const Category = require('../models/Category');
const { mockProducts } = require('../data/mockProducts');

// Optimized product cache
const productCache = {
  all: null,
  featured: null,
  byCategory: {},
  lastUpdated: null,
  TTL: 5 * 60 * 1000 // 5 minutes
};

// Check if database is connected (this will be passed from the route)
const isDatabaseConnected = () => {
  return global.isDbConnected !== false;
};

// Optimized cache getter
function getCachedProducts(type = 'all', category = null) {
  const now = Date.now();
  
  // Check cache validity
  if (productCache.lastUpdated && (now - productCache.lastUpdated) < productCache.TTL) {
    if (type === 'featured' && productCache.featured) return productCache.featured;
    if (type === 'category' && category && productCache.byCategory[category]) {
      return productCache.byCategory[category];
    }
    if (type === 'all' && productCache.all) return productCache.all;
  }
  
  // Refresh cache
  productCache.all = mockProducts;
  productCache.featured = mockProducts.filter(p => p.featured);
  
  // Cache by category
  productCache.byCategory = {};
  const categories = [...new Set(mockProducts.map(p => p.category))];
  categories.forEach(cat => {
    productCache.byCategory[cat] = mockProducts.filter(p => p.category === cat);
  });
  
  productCache.lastUpdated = now;
  
  // Return requested data
  if (type === 'featured') return productCache.featured;
  if (type === 'category' && category) return productCache.byCategory[category] || [];
  return productCache.all;
}

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {    // Check if database is connected
    if (!isDatabaseConnected()) {
      // Optimized filtering for demo mode
      let filteredProducts;
      
      // Use category cache if available
      if (req.query.category) {
        filteredProducts = getCachedProducts('category', req.query.category);
      } else {
        filteredProducts = getCachedProducts('all');
      }
      
      // Apply additional filters
      if (req.query.search) {
        const searchTerm = req.query.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      if (req.query.featured === 'true') {
        if (!req.query.category && !req.query.search) {
          // Use featured cache if no other filters
          filteredProducts = getCachedProducts('featured');
        } else {
          filteredProducts = filteredProducts.filter(p => p.featured);
        }
      }
      
      // Apply sorting (optimized)
      switch (req.query.sort) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rating':
          filteredProducts.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
          break;
        default:
          // Default sort: featured first, then by name
          filteredProducts.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.name.localeCompare(b.name);
          });
      }
      
      // Apply pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(skip, skip + limit);
      
      return res.json({
        success: true,
        data: {
          products: paginatedProducts,
          pagination: {
            page,
            limit,
            total: filteredProducts.length,
            pages: Math.ceil(filteredProducts.length / limit)
          }
        },
        message: 'Products retrieved (demo mode)'
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { status: 'active' };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.brand) {
      filter.brand = new RegExp(req.query.brand, 'i');
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.search) {
      filter.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') },
        { tags: new RegExp(req.query.search, 'i') }
      ];
    }

    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    // Build sort object
    let sort = {};
    switch (req.query.sort) {
      case 'price_asc':
        sort.price = 1;
        break;
      case 'price_desc':
        sort.price = -1;
        break;
      case 'name_asc':
        sort.name = 1;
        break;
      case 'name_desc':
        sort.name = -1;
        break;  
      case 'rating':
        sort['ratings.average'] = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      default:
        sort.featured = -1;
        sort.createdAt = -1;
    }

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: page,
          pages: totalPages,
          total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {    // Check if database is connected
    if (!isDatabaseConnected()) {
      const productId = parseInt(req.params.id);
      const cachedProducts = getCachedProducts('all');
      const product = cachedProducts.find(p => p.id === productId || p.id === req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      return res.json({
        success: true,
        data: product,
        message: 'Product retrieved (demo mode)'
      });
    }
    
    const product = await Product.findOne({ 
      _id: req.params.id, 
      status: 'active' 
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    // PERFORMANCE TEST: Use static data only
    const featuredProducts = getCachedProducts('featured').slice(0, limit);

    res.json({
      success: true,
      data: featuredProducts,
      message: 'Featured products retrieved (static mode)'
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    // PERFORMANCE TEST: Use static categories from products
    const cachedProducts = getCachedProducts('all');
    const categories = [...new Set(cachedProducts.map(p => p.category))]
      .map(category => ({
        name: category,
        slug: category.toLowerCase(),
        status: 'active'
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: categories,
      message: 'Categories retrieved (static mode)'
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    // PERFORMANCE TEST: Use static data search
    const searchTerm = q.trim().toLowerCase();
    const cachedProducts = getCachedProducts('all');
    
    const results = cachedProducts
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        product.brand.toLowerCase().includes(searchTerm)
      )
      .slice(0, parseInt(limit))
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        category: product.category,
        brand: product.brand
      }));

    res.json({
      success: true,
      data: results,
      message: 'Search completed (static mode)'
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching products'
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getCategories,
  searchProducts
};
