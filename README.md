# Unhemmed E-Store

A full-stack e-commerce application built with React.js and Node.js, featuring user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Live Demo

**Note:** The backend is hosted on Render, which may take 30-60 seconds to spin up the services on first load after periods of inactivity.

## 📁 Project Structure

```
UnhemmedEstore/
├── backend/                    # Node.js Express Server
│   ├── api/                   # API entry point
│   │   └── server.js          # Vercel serverless function
│   ├── config/                # Configuration files
│   │   └── database.js        # MongoDB connection setup
│   ├── controllers/           # Request handlers
│   │   ├── authController.js  # Authentication logic
│   │   ├── orderController.js # Order management
│   │   └── productController.js # Product operations
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   └── validation.js     # Input validation
│   ├── models/               # MongoDB schemas
│   │   ├── Category.js       # Product categories
│   │   ├── Order.js          # Order data model
│   │   ├── Product.js        # Product data model
│   │   └── User.js           # User data model
│   ├── routes/               # API routes
│   │   ├── authRoutes.js     # Authentication endpoints
│   │   ├── orderRoutes.js    # Order endpoints
│   │   └── productRoutes.js  # Product endpoints
│   ├── scripts/              # Database utilities
│   │   ├── initDatabase.js   # Database initialization
│   │   ├── seedData.js       # Seed sample data
│   │   └── seedProducts.js   # Seed product data
│   ├── package.json          # Backend dependencies
│   ├── server.js            # Main server file
│   └── vercel.json          # Vercel deployment config
│
├── frontend/                  # React Application (Not included in repo)
│
├── public/                   # Static assets
│   ├── css/                  # Stylesheets
│   │   ├── output.css        # Compiled Tailwind CSS
│   │   └── style.css         # Custom styles
│   ├── images/               # Image assets
│   │   ├── hero/            # Hero section images
│   │   ├── homepage/        # Homepage images
│   │   ├── mens/            # Men's product images
│   │   ├── womens/          # Women's product images
│   │   └── placeholder.svg  # Default placeholder
│   └── js/                   # Client-side JavaScript
│       ├── auth.js          # Authentication helpers
│       ├── main.js          # Main application logic
│       └── preloader.js     # Page loading animation
│
├── views/                    # EJS Templates
│   ├── about.ejs            # About page
│   ├── auth-message.ejs     # Authentication messages
│   ├── cart.ejs             # Shopping cart
│   ├── contact.ejs          # Contact page
│   ├── forgot-password.ejs  # Password recovery
│   ├── index.ejs            # Homepage
│   ├── layout.ejs           # Base layout template
│   ├── login.ejs            # Login page
│   ├── orders.ejs           # Order history
│   ├── product-detail.ejs   # Product details
│   ├── products.ejs         # Product catalog
│   ├── profile.ejs          # User profile
│   ├── register.ejs         # User registration
│   ├── reset-password.ejs   # Password reset
│   └── 404.ejs              # Error page
│
├── AUTHENTICATION_SYSTEM.md  # Authentication documentation
├── DEPLOY-GUIDE.md           # Deployment instructions
├── ENV-VARIABLES.md          # Environment variables guide
├── package.json              # Root dependencies
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # This file
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting
- **Morgan** - HTTP request logger

### Frontend
- **EJS** - Embedded JavaScript templating
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Client-side interactivity
- **Axios** - HTTP client for API requests

### Database
- **MongoDB Atlas** - Cloud database service
- **Mongoose** - Object Document Mapper (ODM)

### Deployment
- **Render** - Backend hosting
- **Vercel** - Alternative deployment option

## 🚀 Features

### User Management
- User registration and authentication
- JWT-based secure sessions
- Password hashing with bcrypt
- Email verification system
- Password reset functionality
- User profile management

### Product Management
- Product catalog with categories
- Product search and filtering
- Featured products display
- Product image management
- Inventory tracking
- Product ratings and reviews

### Shopping Experience
- Shopping cart functionality
- Add/remove items from cart
- Cart persistence across sessions
- Real-time cart updates
- Checkout process
- Order confirmation

### Order Management
- Order creation and tracking
- Order history for users
- Order status updates
- Order cancellation
- Payment integration ready

### Security Features
- JWT token authentication
- Password encryption
- Input validation and sanitization
- XSS protection
- Rate limiting
- CORS configuration
- MongoDB injection protection

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=production
PORT=3003
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Email Configuration (optional)
EMAIL_FROM=noreply@yourdomain.com
```

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/KhalilA93/UnhemmedEstore.git
   cd UnhemmedEstore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the example above into a `.env` file
   - Replace placeholder values with your actual configuration

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Start the production server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get product categories
- `GET /api/products/search` - Search products

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

## 📁 Key Directories Explained

### `/backend`
Contains the complete Node.js Express server with:
- **API routes** for handling HTTP requests
- **Controllers** containing business logic
- **Models** defining data structures
- **Middleware** for authentication and validation
- **Database configuration** and connection management

### `/views`
EJS templates for server-side rendered pages:
- Dynamic content rendering
- Reusable layout components
- SEO-friendly markup
- Server-side data binding

### `/public`
Static assets served directly by Express:
- **CSS files** including Tailwind compilation
- **JavaScript files** for client-side functionality
- **Images** organized by category
- **Icons and graphics**

### `/scripts`
Database management utilities:
- Database initialization scripts
- Data seeding for development
- Migration utilities

## 🔒 Security Implementation

- **Authentication**: JWT tokens with secure HTTP-only cookies
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Content sanitization and CSP headers
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for secure cross-origin requests
- **Database Security**: MongoDB injection protection

## 🚀 Deployment

The application is configured for deployment on:
- **Render** (current hosting)
- **Vercel** (alternative option)
- **Railway** (alternative option)
- **Heroku** (alternative option)

See `DEPLOY-GUIDE.md` for detailed deployment instructions.

## 📄 Additional Documentation

- [`AUTHENTICATION_SYSTEM.md`](./AUTHENTICATION_SYSTEM.md) - Authentication implementation details
- [`DEPLOY-GUIDE.md`](./DEPLOY-GUIDE.md) - Deployment instructions
- [`ENV-VARIABLES.md`](./ENV-VARIABLES.md) - Environment variables reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational and portfolio purposes.

## 👨‍💻 Author

**Khalil Ahmad**
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn URL]
- GitHub: [@KhalilA93](https://github.com/KhalilA93)