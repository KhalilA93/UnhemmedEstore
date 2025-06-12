const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes - temporarily disabled
// const productRoutes = require('./routes/productRoutes');
// const authRoutes = require('./routes/authRoutes');

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

// API Routes - temporarily disabled due to MongoDB not running
// Middleware to check database status for API routes
// app.use('/api/*', (req, res, next) => {
//   if (!isDbConnected) {
//     return res.status(503).json({
//       success: false,
//       message: 'Database not available. Server running in demo mode.',
//       demo: true
//     });
//   }
//   next();
// });

// app.use('/api/products', productRoutes);
// app.use('/api/auth', authRoutes);

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
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'EliteStore - Premium Products',
        products: sampleProducts.filter(p => p.featured)
    });
});

app.get('/products', (req, res) => {
    res.render('products', { 
        title: 'Our Products - EliteStore',
        products: sampleProducts
    });
});

app.get('/product/:id', (req, res) => {
    const product = sampleProducts.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).render('404', { title: 'Product Not Found' });
    }
    res.render('product-detail', { 
        title: `${product.name} - EliteStore`,
        product 
    });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us - EliteStore' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us - EliteStore' });
});

app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Shopping Cart - EliteStore' });
});

app.get('/setup', (req, res) => {
    res.render('setup', { 
        title: 'Database Setup - EliteStore',
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
    res.render('checkout', { title: 'Checkout - EliteStore' });
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
                <title>Page Not Found - EliteStore</title>
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
