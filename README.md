# EliteStore - Premium E-Commerce Platform

A modern, responsive e-commerce website built with Node.js, Express, and EJS templating. Features a professional brochure-style design with mobile-first approach using Tailwind CSS.

## ✨ Features

- **🎨 Modern Design**: Professional brochure-style layout with Tailwind CSS
- **📱 Mobile-First**: Fully responsive design optimized for all devices
- **🛒 Shopping Cart**: Interactive cart with real-time updates and localStorage persistence
- **🔍 Product Showcase**: Beautiful product cards with hover effects and lazy loading
- **📧 Newsletter**: Interactive subscription form with loading states
- **🚀 Performance**: Optimized assets and smooth animations
- **🔒 SEO Ready**: Semantic HTML structure and meta tags
- **🎯 User Experience**: Intuitive navigation and interactive elements

## 🛠️ Tech Stack

### Frontend
- **Styling**: Tailwind CSS 3.x with custom configuration
- **JavaScript**: ES6+ with modern DOM manipulation
- **Icons**: Heroicons and custom SVG icons
- **Animations**: Tailwind transitions and custom CSS animations

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Templating**: EJS with partials
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt hashing

### Development
- **Package Manager**: npm
- **Process Manager**: Nodemon for development
- **CSS Processing**: PostCSS with Tailwind CSS
- **Environment**: dotenv for configuration

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone/Download the project**
   ```bash
   git clone <repository-url>
   cd "EComemerse site"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file with your configuration
   cp .env.example .env
   ```

4. **Database Setup**
   ```bash
   # Seed the database with sample data
   npm run seed
   ```

### 🏃‍♂️ Running the Application

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
EliteStore/
├── 📁 config/
│   └── database.js              # MongoDB connection configuration
├── 📁 controllers/
│   ├── authController.js        # Authentication logic
│   └── productController.js     # Product management logic
├── 📁 middleware/
│   └── auth.js                  # Authentication middleware
├── 📁 models/
│   ├── Category.js              # Category schema
│   ├── Order.js                 # Order schema
│   ├── Product.js               # Product schema
│   └── User.js                  # User schema
├── 📁 public/
│   ├── 📁 css/
│   │   └── output.css           # Compiled Tailwind CSS
│   ├── 📁 js/
│   │   └── main.js              # Frontend JavaScript
│   └── 📁 images/               # Product and static images
├── 📁 routes/
│   ├── authRoutes.js            # Authentication routes
│   └── productRoutes.js         # Product API routes
├── 📁 scripts/
│   ├── seedData.js              # Database seeding script
│   └── README.md                # Scripts documentation
├── 📁 views/
│   ├── about.ejs                # About page
│   ├── cart.ejs                 # Shopping cart page
│   ├── contact.ejs              # Contact page
│   ├── index.ejs                # Homepage
│   └── products.ejs             # Products catalog
├── server.js                    # Main application server
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # Project documentation
```

## 🎯 Features Implemented

### 🏠 Homepage (`/`)
- **Hero Section**: Gradient background with compelling call-to-action
- **Feature Highlights**: Free shipping, secure payment, 24/7 support cards
- **Featured Products**: Dynamic product showcase with hover effects
- **Newsletter Signup**: Interactive subscription with loading states
- **Mobile Navigation**: Hamburger menu with smooth animations

### 🛍️ Products Page (`/products`)
- **Product Grid**: Responsive card layout with Tailwind CSS
- **Interactive Cards**: Hover effects and smooth transitions
- **Add to Cart**: Real-time cart updates with notifications
- **Filter Ready**: UI prepared for category and price filtering
- **Lazy Loading**: Optimized image loading for performance

### 🛒 Shopping Cart (`/cart`)
- **Dynamic Cart**: Real-time quantity updates and calculations
- **Local Storage**: Cart persistence across browser sessions
- **Responsive Design**: Mobile-friendly cart interface
- **Checkout Ready**: Prepared for payment integration
- **Empty State**: Elegant empty cart design

### ℹ️ About Page (`/about`)
- **Company Story**: Professional brand narrative
- **Team Section**: Leadership and key personnel
- **Values**: Mission, vision, and company principles
- **Timeline**: Company milestones and achievements

### 📞 Contact Page (`/contact`)
- **Contact Form**: Professional inquiry form with validation
- **Location Info**: Store address and business hours
- **Multiple Channels**: Phone, email, and social media links
- **Interactive Elements**: Form validation and submission feedback

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3B82F6 to #1E40AF)
- **Secondary**: Indigo accents (#6366F1)
- **Success**: Green notifications (#10B981)
- **Warning**: Amber alerts (#F59E0B)
- **Error**: Red states (#EF4444)
- **Neutral**: Gray scales for text and backgrounds

### Typography
- **Headings**: Inter font family with bold weights
- **Body**: System font stack for optimal readability
- **Code**: Monospace for technical elements

### Components
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Cards**: Product cards, feature cards, testimonial cards
- **Forms**: Styled inputs, textareas, and validation states
- **Navigation**: Desktop and mobile navigation patterns

## 🔧 Configuration & Customization

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/elitestore
DB_NAME=elitestore

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d

# Email Configuration (for newsletter)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Tailwind CSS Customization
Edit `tailwind.config.js` to customize the design system:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

### Adding New Products
Use the seeding script or add products via API:

```javascript
// Using the seed script
npm run seed

// Or programmatically
const product = new Product({
  name: 'Product Name',
  price: 99.99,
  description: 'Product description',
  category: 'electronics',
  image: '/images/product.jpg'
});
```

## 🚀 Development Workflow

### Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production server
npm start

# Seed database with sample data
npm run seed

# Build Tailwind CSS (if needed)
npm run build-css
```

### Database Management

```bash
# Connect to MongoDB
mongosh

# Use the database
use elitestore

# View collections
show collections

# View products
db.products.find().pretty()
```

## 🔄 API Endpoints

### Products API
```
GET    /api/products          # Get all products
GET    /api/products/:id      # Get single product
POST   /api/products          # Create new product (admin)
PUT    /api/products/:id      # Update product (admin)
DELETE /api/products/:id      # Delete product (admin)
```

### Authentication API
```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
GET    /api/auth/profile      # Get user profile
PUT    /api/auth/profile      # Update user profile
```

### Categories API
```
GET    /api/categories        # Get all categories
POST   /api/categories        # Create category (admin)
```

## 📋 Next Steps & Roadmap

### Phase 1: Database Integration ✅
- [x] MongoDB setup and configuration
- [x] Mongoose models for products, users, orders
- [x] Database seeding script
- [ ] Enable database connections in server.js

### Phase 2: Enhanced Functionality
- [ ] User authentication (login/register)
- [ ] Product search and filtering
- [ ] Shopping cart backend persistence
- [ ] Order management system
- [ ] Admin dashboard for product management

### Phase 3: Advanced Features
- [ ] Payment processing (Stripe/PayPal integration)
- [ ] Email notifications and confirmations
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Inventory management
- [ ] Multi-language support

### Phase 4: Optimization & Deployment
- [ ] Image optimization and CDN integration
- [ ] Performance monitoring
- [ ] SEO enhancements
- [ ] Production deployment (AWS/Heroku)
- [ ] CI/CD pipeline setup

## 🛡️ Security Features

- **Input Validation**: Mongoose schema validation
- **Password Hashing**: bcrypt for user passwords
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configured for production
- **Rate Limiting**: API endpoint protection
- **SQL Injection Prevention**: NoSQL injection protection

## 📱 Browser Support

- ✅ Chrome (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Edge (latest 2 versions)
- ✅ Mobile Safari (iOS 12+)
- ✅ Chrome Mobile (Android 8+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join our community discussions
- **Email**: Contact support@elitestore.com

---

**EliteStore** - Built with ❤️ using modern web technologies
