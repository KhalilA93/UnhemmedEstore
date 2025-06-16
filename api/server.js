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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

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

// Frontend Routes
app.get('/', async (req, res) => {
    try {
        let featuredProducts = [];
        if (isDbConnected) {
            // Get featured products from database
            featuredProducts = await Product.find({ 
                status: 'active', 
                featured: true 
            }).limit(6).lean();
        } else {
            // Use sample data if database not connected
            featuredProducts = sampleProducts.filter(p => p.featured);
        }
          res.render('index', { 
            title: 'Unhemmed - Premium Clothing',
            products: featuredProducts
        });
    } catch (error) {
        console.error('Error fetching products:', error);        res.render('index', { 
            title: 'Unhemmed - Premium Clothing',
            products: sampleProducts.filter(p => p.featured)
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
            products = sampleProducts;
            
            // Filter by search term if provided
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                products = products.filter(product => 
                    product.name.toLowerCase().includes(search) ||
                    product.description.toLowerCase().includes(search) ||
                    (product.category && product.category.toLowerCase().includes(search))
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
        
        res.render('products', { 
            title: title,
            products: products,
            currentCategory: category || 'All',
            searchTerm: searchTerm || ''
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('products', { 
            title: 'Our Products - Unhemmed',
            products: sampleProducts,
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
            products = sampleProducts;
        }
        
        res.render('products', { 
            title: "Men's Clothing - Unhemmed",
            products: products,
            currentCategory: 'Men'
        });
    } catch (error) {
        console.error('Error fetching men\'s products:', error);
        res.render('products', { 
            title: "Men's Clothing - Unhemmed",
            products: sampleProducts,
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
            products = sampleProducts;
        }
        
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
        if (isDbConnected) {
            product = await Product.findById(req.params.id).lean();
        } else {
            // Handle both string and numeric IDs for demo mode
            const productId = parseInt(req.params.id);
            product = sampleProducts.find(p => p.id === productId || p.id === req.params.id);
        }
        
        if (!product) {
            return res.status(404).render('404', { title: 'Product Not Found' });
        }
        
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
