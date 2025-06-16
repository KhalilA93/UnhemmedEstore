const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('../config/database');

// Import routes
const authRoutes = require('../routes/authRoutes');
const productRoutes = require('../routes/productRoutes');
const orderRoutes = require('../routes/orderRoutes');

// Import models
const Product = require('../models/Product');

const app = express();

// Global variable to track database connection status
let isDbConnected = false;

// Connect to database
const initializeDatabase = async () => {
  isDbConnected = await connectDB();
  if (!isDbConnected) {
    console.log('🚀 Server running in DEMO MODE with sample data');
  }
};

// Initialize database connection
initializeDatabase();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Add compression middleware for better performance
app.use((req, res, next) => {
  // Basic compression headers
  if (req.headers['accept-encoding'] && req.headers['accept-encoding'].includes('gzip')) {
    res.set('Content-Encoding', 'gzip');
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with caching
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d', // Cache static files for 1 day
  etag: true,
  lastModified: true
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// API Routes
// Middleware to check database status for API routes
app.use('/api/*', (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database not available. Server running in demo mode.',
      demo: true
    });
  }
  next();
});

// API Routes - testing auth routes first
// Middleware to pass database status to controllers
app.use('/api/products', (req, res, next) => {
  global.isDbConnected = isDbConnected;
  next();
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Import the updated products data
const { mockProducts } = require('../data/mockProducts');

// Use updated products as sample data for demo (will be replaced by database queries)
const sampleProducts = mockProducts;

// Cache for frequently accessed data
const productCache = {
  featured: null,
  all: null,
  lastUpdated: null,
  TTL: 5 * 60 * 1000 // 5 minutes cache
};

// Helper function to get cached or fresh data
function getCachedProducts(type = 'all') {
  const now = Date.now();
  
  // Check if cache is still valid
  if (productCache.lastUpdated && (now - productCache.lastUpdated) < productCache.TTL) {
    if (type === 'featured' && productCache.featured) {
      return productCache.featured;
    }
    if (type === 'all' && productCache.all) {
      return productCache.all;
    }
  }
  
  // Refresh cache
  productCache.all = sampleProducts;
  productCache.featured = sampleProducts.filter(p => p.featured);
  productCache.lastUpdated = now;
  
  return type === 'featured' ? productCache.featured : productCache.all;
}

// Frontend Routes
app.get('/', async (req, res) => {
    try {
        let featuredProducts = [];
        if (isDbConnected) {
            // Get featured products from database with caching
            featuredProducts = await Product.find({ 
                status: 'active', 
                featured: true 
            }).limit(6).lean().cache(300); // 5 minute cache if supported
        } else {
            // Use cached sample data
            featuredProducts = getCachedProducts('featured').slice(0, 6);
        }
        
        // Set cache headers for browser caching
        res.set({
            'Cache-Control': 'public, max-age=300', // 5 minutes
            'ETag': `"${Date.now()}"` 
        });
        
        res.render('index', { 
            title: 'Unhemmed - Premium Clothing',
            products: featuredProducts
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        
        // Fallback with cache headers
        res.set({
            'Cache-Control': 'public, max-age=60' // 1 minute for errors
        });
        
        res.render('index', { 
            title: 'Unhemmed - Premium Clothing',
            products: getCachedProducts('featured').slice(0, 6)
        });
    }
});

app.get('/products', async (req, res) => {
    try {
        let products = [];
        const category = req.query.category; // 'Men' or 'Women'
        const searchTerm = req.query.search; // Search query
          if (isDbConnected) {
            const filter = { status: 'active' };
            
            // Add category filter
            if (category && ['Men', 'Women'].includes(category)) {
                filter.category = category;
            }
            
            // Add search filter
            if (searchTerm) {
                filter.$or = [
                    { name: new RegExp(searchTerm, 'i') },
                    { description: new RegExp(searchTerm, 'i') },
                    { shortDescription: new RegExp(searchTerm, 'i') },
                    { subcategory: new RegExp(searchTerm, 'i') },
                    { brand: new RegExp(searchTerm, 'i') },
                    { tags: new RegExp(searchTerm, 'i') }
                ];
            }
            
            products = await Product.find(filter).lean();
        } else {
            // Use cached products for better performance
            products = getCachedProducts('all');
            
            // Apply category filter first (most selective)
            if (category && ['Men', 'Women'].includes(category)) {
                products = products.filter(product => product.category === category);
            }
            
            // Apply search filter
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                products = products.filter(product => 
                    product.name.toLowerCase().includes(search) ||
                    product.description.toLowerCase().includes(search) ||
                    product.shortDescription?.toLowerCase().includes(search) ||
                    product.subcategory?.toLowerCase().includes(search) ||
                    product.brand?.toLowerCase().includes(search) ||
                    product.tags?.some(tag => tag.toLowerCase().includes(search))
                );
            }
        }
        
        let title = 'Our Clothing Collection - Unhemmed';
        if (category) {
            title = `${category === 'Men' ? "Men's" : "Women's"} Clothing - Unhemmed`;
        }
        if (searchTerm) {
            title = `Search Results for "${searchTerm}" - Unhemmed`;
        }
        
        // Set cache headers
        const cacheTime = searchTerm ? 60 : 300; // Less cache for search results
        res.set({
            'Cache-Control': `public, max-age=${cacheTime}`,
            'ETag': `"${category || 'all'}-${searchTerm || 'none'}-${Date.now()}"`
        });
        
        res.render('products', { 
            title: title,
            products: products,
            currentCategory: category || 'All',
            searchTerm: searchTerm || ''
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        
        // Fallback to cached products
        let fallbackProducts = getCachedProducts('all');
        
        if (req.query.category) {
            fallbackProducts = fallbackProducts.filter(p => p.category === req.query.category);
        }
        
        res.render('products', { 
            title: 'Our Products - Unhemmed',
            products: fallbackProducts,
            currentCategory: 'All',
            searchTerm: ''
        });
    }
});

// Men's clothing route
app.get('/men', async (req, res) => {
    try {
        let products = [];
        if (isDbConnected) {
            products = await Product.find({ 
                status: 'active', 
                category: 'Men' 
            }).lean();
        } else {
            // Use cached category data
            products = getCachedProducts('all').filter(p => p.category === 'Men');
        }
        
        // Set cache headers
        res.set({
            'Cache-Control': 'public, max-age=300',
            'ETag': '"men-products"'
        });
        
        res.render('products', { 
            title: "Men's Clothing - Unhemmed",
            products: products,
            currentCategory: 'Men'
        });
    } catch (error) {
        console.error('Error fetching men\'s products:', error);
        
        const fallbackProducts = getCachedProducts('all').filter(p => p.category === 'Men');
        res.render('products', { 
            title: "Men's Clothing - Unhemmed",
            products: fallbackProducts,
            currentCategory: 'Men'
        });
    }
});

// Women's clothing route
app.get('/women', async (req, res) => {
    try {
        let products = [];
        if (isDbConnected) {
            products = await Product.find({ 
                status: 'active', 
                category: 'Women' 
            }).lean();
        } else {
            // Use cached category data
            products = getCachedProducts('all').filter(p => p.category === 'Women');
        }
        
        // Set cache headers
        res.set({
            'Cache-Control': 'public, max-age=300',
            'ETag': '"women-products"'
        });
        
        res.render('products', { 
            title: "Women's Clothing - Unhemmed",
            products: products,
            currentCategory: 'Women'
        });
    } catch (error) {
        console.error('Error fetching women\'s products:', error);
        res.render('products', { 
            title: "Women's Clothing - Unhemmed",
            products: sampleProducts,
            currentCategory: 'Women'
        });
    }
});

app.get('/product/:id', async (req, res) => {
    try {
        let product = null;
        const productId = req.params.id;
        
        if (isDbConnected) {
            product = await Product.findById(productId).lean();
        } else {
            // Use cached products for faster lookup
            const cachedProducts = getCachedProducts('all');
            const numericId = parseInt(productId);
            product = cachedProducts.find(p => p.id === numericId || p.id === productId);
        }
        
        if (!product) {
            return res.status(404).render('404', { title: 'Product Not Found' });
        }
        
        // Set cache headers for product pages
        res.set({
            'Cache-Control': 'public, max-age=600', // 10 minutes for product details
            'ETag': `"product-${productId}-${Date.now()}"`
        });
        
        res.render('product-detail', { 
            title: `${product.name} - Unhemmed`,
            product 
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(404).render('404', { title: 'Product Not Found' });
    }
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us - Unhemmed' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us - Unhemmed' });
});

app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Shopping Cart - Unhemmed' });
});

// Profile and Orders pages (require authentication)
app.get('/profile', (req, res) => {
    res.render('profile', { title: 'My Profile - Unhemmed' });
});

app.get('/orders', (req, res) => {
    res.render('orders', { title: 'My Orders - Unhemmed' });
});

// Authentication routes
app.get('/login', (req, res) => {
    res.render('login', { title: 'Sign In - Unhemmed' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Create Account - Unhemmed' });
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password - Unhemmed' });
});

app.get('/reset-password', (req, res) => {
    res.render('reset-password', { title: 'Reset Password - Unhemmed' });
});

app.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    
    if (!token) {
        return res.render('auth-message', { 
            title: 'Email Verification - Unhemmed',
            type: 'error',
            message: 'Invalid verification link',
            redirectUrl: '/login'
        });
    }
    
    try {
        // If database is connected, verify the token
        if (isDbConnected) {
            const response = await fetch(`${req.protocol}://${req.get('host')}/api/auth/verify-email/${token}`, {
                method: 'GET'
            });
            const result = await response.json();
            
            if (result.success) {
                return res.render('auth-message', {
                    title: 'Email Verified - Unhemmed',
                    type: 'success',
                    message: 'Your email has been verified successfully! You can now sign in.',
                    redirectUrl: '/login'
                });
            } else {
                return res.render('auth-message', {
                    title: 'Verification Failed - Unhemmed',
                    type: 'error',
                    message: result.message || 'Email verification failed',
                    redirectUrl: '/login'
                });
            }
        } else {
            return res.render('auth-message', {
                title: 'Service Unavailable - Unhemmed',
                type: 'warning',
                message: 'Email verification service is currently unavailable',
                redirectUrl: '/login'
            });
        }
    } catch (error) {
        console.error('Email verification error:', error);
        return res.render('auth-message', {
            title: 'Verification Error - Unhemmed',
            type: 'error',
            message: 'An error occurred during email verification',
            redirectUrl: '/login'
        });
    }
});

app.get('/setup', (req, res) => {
    res.render('setup', { 
        title: 'Database Setup - Unhemmed',
        isDbConnected: isDbConnected 
    });
});

app.get('/MONGODB_SETUP.md', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'MONGODB_SETUP.md');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('Setup guide not found');
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
    });
});

app.get('/checkout', (req, res) => {
    res.render('checkout', { title: 'Checkout - Unhemmed' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(404).json({
            success: false,
            message: 'API endpoint not found'
        });
    } else {
        res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Page Not Found - Unhemmed</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #333; }
                    a { color: #2563eb; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/">Return to Home</a>
            </body>
            </html>
        `);
    }
});

// For Vercel serverless deployment
module.exports = app;
