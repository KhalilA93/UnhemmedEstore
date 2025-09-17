const express = require('express');
const cors = require('cors');
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
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Trust proxy (for proper rate limiting when behind proxy)
app.set('trust proxy', 1);

// Application state
const appState = {
  isDbConnected: false,
  startTime: new Date().toISOString()
};

// Database initialization with proper error handling
const initializeDatabase = async () => {
  try {
    appState.isDbConnected = await connectDB();
    
    if (appState.isDbConnected) {
      console.log('✅ Database connected successfully');
    } else {
      console.log('� Server running in DEMO MODE with sample data');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    appState.isDbConnected = false;
  }
};

// Security configuration constants
const SECURITY_CONFIG = {
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  bodyLimit: '10mb'
};

// CORS allowed origins configuration
const getAllowedOrigins = () => [
  'http://localhost:3000', // Development
  'https://localhost:3000', // HTTPS Development
  'https://unhemmedestore-frontend.onrender.com', // Production frontend
  process.env.CLIENT_URL, // Production frontend URL from env
].filter(Boolean); // Remove undefined values

// Initialize database connection
initializeDatabase();

// Security Middleware Configuration
const configureSecurityMiddleware = () => {
  // Helmet security headers
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

  // Rate limiting configuration
  const limiter = rateLimit({
    windowMs: SECURITY_CONFIG.rateLimitWindow,
    max: SECURITY_CONFIG.rateLimitMax,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', limiter);

  // Body parser middleware
  app.use(express.json({ limit: SECURITY_CONFIG.bodyLimit }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: SECURITY_CONFIG.bodyLimit 
  }));

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // XSS protection middleware
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
};

// Logging configuration
const configureLogging = () => {
  const logFormat = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
  app.use(morgan(logFormat));
};

// CORS configuration
const configureCORS = () => {
  const allowedOrigins = getAllowedOrigins();
  
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('🚫 Blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
};

// Configure all middleware
configureSecurityMiddleware();
configureLogging();
configureCORS();

// API Routes configuration
const configureRoutes = () => {
  app.use('/api/products', productRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/cart', cartRoutes);
};

// Health check endpoint
const configureHealthCheck = () => {
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'Backend server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: appState.isDbConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      startTime: appState.startTime
    });
  });
};

// Error handling middleware
const configureErrorHandling = () => {
  // Global error handler
  app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    
    const errorResponse = {
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Internal server error',
      timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = err.stack;
    }

    res.status(err.status || 500).json(errorResponse);
  });

  // 404 handler - Return JSON for all requests since this is now an API-only backend
  app.use((req, res) => {
    const isApiRequest = req.originalUrl.startsWith('/api/');
    
    res.status(404).json({
      success: false,
      message: isApiRequest ? 'API endpoint not found' : 'Page not found - This is an API server',
      endpoint: req.originalUrl,
      timestamp: new Date().toISOString(),
      ...(isApiRequest ? {} : { 
        note: 'This backend serves API endpoints only. Frontend is served separately.' 
      })
    });
  });
};

// Graceful shutdown configuration
const configureGracefulShutdown = () => {
  const gracefulShutdown = (signal) => {
    console.log(`📡 ${signal} received, shutting down gracefully`);
    process.exit(0);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

// Configure all application components
configureRoutes();
configureHealthCheck();
configureErrorHandling();
configureGracefulShutdown();

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🗄️  Database: ${appState.isDbConnected ? 'Connected' : 'Demo Mode'}`);
    console.log(`⏰ Started at: ${appState.startTime}`);
  });
};

startServer();

module.exports = app;
