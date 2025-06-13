const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
// const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Import models
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;

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
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
// app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Sample data for demo (will be replaced by database queries)
const sampleProducts = [
    {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 299.99,
        comparePrice: 399.99,
        image: '/images/headphones.jpg',
        description: 'High-quality wireless headphones with noise cancellation and superior sound quality.',
        category: 'Electronics',
        featured: true,
        inStock: true
    },
    {
        id: 2,
        name: 'Smart Watch Pro',
        price: 399.99,
        comparePrice: 499.99,
        image: '/images/smartwatch.jpg',
        description: 'Advanced fitness tracking, heart rate monitoring, and smart notifications.',
        category: 'Electronics',
        featured: true,
        inStock: true
    },
    {
        id: 3,
        name: 'Premium Laptop Backpack',
        price: 89.99,
        comparePrice: 120.00,
        image: '/images/backpack.jpg',
        description: 'Durable and stylish laptop backpack with multiple compartments and USB charging port.',
        category: 'Accessories',
        featured: true,
        inStock: true
    }
];

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
            product = sampleProducts.find(p => p.id === parseInt(req.params.id));
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
