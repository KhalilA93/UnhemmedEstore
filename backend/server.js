const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const hpp = require('hpp');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import models
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3002;

// Global variable to track database connection status
let isDbConnected = false;

// Connect to database
const initializeDatabase = async () => {
  try {
    isDbConnected = await connectDB();
    if (!isDbConnected) {
      console.log('🚀 Server running in DEMO MODE with sample data');
    }
  } catch (error) {
    console.error('Database connection failed:', error.message);
    isDbConnected = false;
  }
};

// Initialize database connection
initializeDatabase();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
});

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Set view engine for SSR routes (if needed)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Import the updated products data for fallback
const { mockProducts } = require('./data/mockProducts');

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
  productCache.all = mockProducts;
  productCache.featured = mockProducts.filter(p => p.featured);
  productCache.lastUpdated = now;
  
  return type === 'featured' ? productCache.featured : productCache.all;
}

// Frontend Routes (SSR)
app.get('/', async (req, res) => {
    try {
        let featuredProducts = [];
        if (isDbConnected) {
            featuredProducts = await Product.find({ 
                status: 'active', 
                featured: true 
            }).limit(6).lean();
        } else {
            featuredProducts = getCachedProducts('featured').slice(0, 6);
        }
        
        res.set({
            'Cache-Control': 'public, max-age=300' // 5 minutes
        });
        
        res.render('index', { 
            title: 'Unhemmed - Premium Clothing',
            products: featuredProducts
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('index', { 
            title: 'Unhemmed - Premium Clothing',
            products: getCachedProducts('featured').slice(0, 6)
        });
    }
});

app.get('/products', async (req, res) => {
    try {
        const category = req.query.category;
        const searchTerm = req.query.search;
        let products = [];

        if (isDbConnected) {
            const filter = { status: 'active' };
            
            if (category && ['Men', 'Women'].includes(category)) {
                filter.category = category;
            }
            
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
            products = getCachedProducts('all');
            
            if (category && ['Men', 'Women'].includes(category)) {
                products = products.filter(product => product.category === category);
            }
            
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
        
        const cacheTime = searchTerm ? 60 : 300;
        res.set({
            'Cache-Control': `public, max-age=${cacheTime}`
        });
        
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
            products: getCachedProducts('all'),
            currentCategory: 'All',
            searchTerm: ''
        });
    }
});

// Additional frontend routes
app.get('/men', async (req, res) => {
    try {
        let products = [];
        if (isDbConnected) {
            products = await Product.find({ 
                status: 'active', 
                category: 'Men' 
            }).lean();
        } else {
            products = getCachedProducts('all').filter(p => p.category === 'Men');
        }
        
        res.set({ 'Cache-Control': 'public, max-age=300' });
        res.render('products', { 
            title: "Men's Clothing - Unhemmed",
            products: products,
            currentCategory: 'Men',
            searchTerm: ''
        });
    } catch (error) {
        console.error('Error fetching men\'s products:', error);
        const fallbackProducts = getCachedProducts('all').filter(p => p.category === 'Men');
        res.render('products', { 
            title: "Men's Clothing - Unhemmed",
            products: fallbackProducts,
            currentCategory: 'Men',
            searchTerm: ''
        });
    }
});

app.get('/women', async (req, res) => {
    try {
        let products = [];
        if (isDbConnected) {
            products = await Product.find({ 
                status: 'active', 
                category: 'Women' 
            }).lean();
        } else {
            products = getCachedProducts('all').filter(p => p.category === 'Women');
        }
        
        res.set({ 'Cache-Control': 'public, max-age=300' });
        res.render('products', { 
            title: "Women's Clothing - Unhemmed",
            products: products,
            currentCategory: 'Women',
            searchTerm: ''
        });
    } catch (error) {
        console.error('Error fetching women\'s products:', error);
        const fallbackProducts = getCachedProducts('all').filter(p => p.category === 'Women');
        res.render('products', { 
            title: "Women's Clothing - Unhemmed",
            products: fallbackProducts,
            currentCategory: 'Women',
            searchTerm: ''
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
            const cachedProducts = getCachedProducts('all');
            const numericId = parseInt(productId);
            product = cachedProducts.find(p => p.id === numericId || p.id === productId);
        }
        
        if (!product) {
            return res.status(404).render('404', { title: 'Product Not Found' });
        }
        
        res.set({ 'Cache-Control': 'public, max-age=600' });
        res.render('product-detail', { 
            title: `${product.name} - Unhemmed`,
            product 
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(404).render('404', { title: 'Product Not Found' });
    }
});

// Static pages
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: isDbConnected ? 'connected' : 'disconnected'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    if (process.env.NODE_ENV === 'development') {
        res.status(err.status || 500).json({
            success: false,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(err.status || 500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// 404 handler
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(404).json({
            success: false,
            message: 'API endpoint not found',
            endpoint: req.originalUrl
        });
    } else {
        res.status(404).render('404', { title: 'Page Not Found - Unhemmed' });
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🗄️  Database: ${isDbConnected ? 'Connected' : 'Demo Mode'}`);
});

module.exports = app;
