const mongoose = require('mongoose');
require('dotenv').config();

// Import models to register them
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    console.log('Connection string:', process.env.MONGODB_URI);
    
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Check existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Existing collections:', collections.map(c => c.name));

    // Create indexes for better performance
    console.log('🔧 Creating database indexes...');
    
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1, status: 1 });
    
    // Product indexes (if Product model exists)
    try {
      await Product.collection.createIndex({ name: 'text', description: 'text' });
      await Product.collection.createIndex({ category: 1, featured: 1 });
      await Product.collection.createIndex({ price: 1 });
      console.log('✅ Product indexes created');
    } catch (error) {
      console.log('⚠️  Product indexes skipped (model may not exist yet)');
    }

    // Test basic operations
    console.log('🧪 Testing database operations...');
    
    // Count existing users
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);

    // Test write operation (create a test user if none exist)
    if (userCount === 0) {
      console.log('📝 Creating admin user...');
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@elitestore.com',
        password: 'Admin123!',
        role: 'admin',
        emailVerified: true
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 MongoDB connection refused. Make sure MongoDB is running:');
      console.log('   Windows: net start MongoDB');
      console.log('   Mac/Linux: sudo systemctl start mongod');
      console.log('   Or: mongod --dbpath /path/to/your/data');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 MongoDB authentication failed. Check your credentials in .env file');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the initialization
initializeDatabase();
