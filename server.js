const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// PERFORMANCE TEST: Database imports commented out for static testing
// const connectDB = require('./config/database');

// Import routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// PERFORMANCE TEST: Model imports commented out for static testing
// const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;

// Global variable to track database connection status
// PERFORMANCE TEST: Force static mode to isolate database performance issues
let isDbConnected = false;

// Connect to database - DISABLED FOR PERFORMANCE TESTING
const initializeDatabase = async () => {
  // isDbConnected = await connectDB(); // Commented out for performance testing
  isDbConnected = false; // Force static mode
  console.log('🧪 PERFORMANCE TEST MODE: Database disabled, using static data only');
};

// Initialize database connection
initializeDatabase();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes - PERFORMANCE TEST: Remove database check middleware
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Import the updated products data
const { mockProducts } = require('./data/mockProducts');

// Use updated products as sample data for demo (will be replaced by database queries)
const sampleProducts = mockProducts;

// Frontend Routes
app.get('/', async (req, res) => {
    try {
        // PERFORMANCE TEST: Always use static data
        const featuredProducts = sampleProducts.filter(p => p.featured);
        
        res.render('index', { 
            title: 'Unhemmed - Premium Clothing',
            products: featuredProducts
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('index', { 
            title: 'Unhemmed - Premium Clothing',
            products: sampleProducts.filter(p => p.featured)
        });
    }
});

app.get('/products', async (req, res) => {
    try {
        // PERFORMANCE TEST: Always use static data
        let products = sampleProducts;
        const category = req.query.category; // 'Men' or 'Women'
        const searchTerm = req.query.search; // Search query
        
        // Filter by category if provided
        if (category && ['Men', 'Women'].includes(category)) {
            products = products.filter(p => p.category === category);
        }
        
        // Filter by search term if provided
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            products = products.filter(product => 
                product.name.toLowerCase().includes(search) ||
                product.description.toLowerCase().includes(search) ||
                (product.category && product.category.toLowerCase().includes(search))
            );
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
        // PERFORMANCE TEST: Always use static data
        const products = sampleProducts.filter(p => p.category === 'Men');
        
        res.render('products', { 
            title: "Men's Clothing - Unhemmed",
            products: products,
            currentCategory: 'Men',
            searchTerm: ''
        });
    } catch (error) {
        console.error('Error fetching men\'s products:', error);
        res.render('products', { 
            title: "Men's Clothing - Unhemmed",
            products: sampleProducts.filter(p => p.category === 'Men'),
            currentCategory: 'Men',
            searchTerm: ''
        });
    }
});

// Women's clothing route
app.get('/women', async (req, res) => {
    try {
        // PERFORMANCE TEST: Always use static data
        const products = sampleProducts.filter(p => p.category === 'Women');
        
        res.render('products', { 
            title: "Women's Clothing - Unhemmed",
            products: products,
            currentCategory: 'Women',
            searchTerm: ''
        });
    } catch (error) {
        console.error('Error fetching women\'s products:', error);
        res.render('products', { 
            title: "Women's Clothing - Unhemmed",
            products: sampleProducts.filter(p => p.category === 'Women'),
            currentCategory: 'Women',
            searchTerm: ''
        });
    }
});

app.get('/product/:id', async (req, res) => {
    try {
        // PERFORMANCE TEST: Always use static data
        const product = sampleProducts.find(p => p.id === parseInt(req.params.id));
        
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
