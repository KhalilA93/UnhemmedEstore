const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

const connectDB = require('../config/database');

// Sample data
const categories = [
    {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic gadgets and devices',
        isActive: true
    },
    {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Premium accessories for everyday use',
        isActive: true
    },
    {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Stylish fashion items and clothing',
        isActive: true
    }
];

const products = [
    {
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        description: 'High-quality wireless headphones with active noise cancellation and superior sound quality. Perfect for music lovers and professionals.',
        shortDescription: 'Wireless headphones with noise cancellation',
        price: 299.99,
        comparePrice: 399.99,
        sku: 'HEADPHONES-001',
        images: ['/images/headphones.jpg'],
        category: 'Electronics',
        inventory: {
            quantity: 50,
            lowStockThreshold: 5
        },
        specifications: {
            'Battery Life': '30 hours',
            'Connectivity': 'Bluetooth 5.0',
            'Noise Cancellation': 'Active',
            'Weight': '250g'
        },
        tags: ['wireless', 'audio', 'premium', 'bluetooth'],
        isFeatured: true,
        isActive: true,
        seoTitle: 'Premium Wireless Headphones - EliteStore',
        seoDescription: 'Shop premium wireless headphones with noise cancellation at EliteStore'
    },
    {
        name: 'Smart Watch Pro',
        slug: 'smart-watch-pro',
        description: 'Advanced fitness tracking smartwatch with heart rate monitoring, GPS, and smart notifications. Stay connected and healthy.',
        shortDescription: 'Fitness smartwatch with GPS and health tracking',
        price: 399.99,
        comparePrice: 499.99,
        sku: 'WATCH-001',
        images: ['/images/smartwatch.jpg'],
        category: 'Electronics',
        inventory: {
            quantity: 30,
            lowStockThreshold: 3
        },
        specifications: {
            'Display': '1.4" AMOLED',
            'Battery Life': '7 days',
            'Water Resistance': '5ATM',
            'GPS': 'Built-in'
        },
        tags: ['smartwatch', 'fitness', 'gps', 'health'],
        isFeatured: true,
        isActive: true,
        seoTitle: 'Smart Watch Pro - Fitness Tracking - EliteStore',
        seoDescription: 'Advanced smartwatch with fitness tracking and GPS at EliteStore'
    },
    {
        name: 'Premium Laptop Backpack',
        slug: 'premium-laptop-backpack',
        description: 'Durable and stylish laptop backpack with multiple compartments, USB charging port, and anti-theft design. Perfect for work and travel.',
        shortDescription: 'Laptop backpack with USB charging port',
        price: 89.99,
        comparePrice: 129.99,
        sku: 'BACKPACK-001',
        images: ['/images/backpack.jpg'],
        category: 'Accessories',
        inventory: {
            quantity: 75,
            lowStockThreshold: 10
        },
        specifications: {
            'Capacity': '20L',
            'Laptop Size': 'Up to 15.6"',
            'Material': 'Water-resistant nylon',
            'USB Port': 'External charging port'
        },
        tags: ['backpack', 'laptop', 'travel', 'usb'],
        isFeatured: true,
        isActive: true,
        seoTitle: 'Premium Laptop Backpack - EliteStore',
        seoDescription: 'Durable laptop backpack with USB charging port at EliteStore'
    },
    {
        name: 'Wireless Earbuds Pro',
        slug: 'wireless-earbuds-pro',
        description: 'True wireless earbuds with premium sound quality, long battery life, and comfortable fit.',
        shortDescription: 'True wireless earbuds with premium sound',
        price: 199.99,
        comparePrice: 249.99,
        sku: 'EARBUDS-001',
        images: ['/images/headphones.jpg'],
        category: 'Electronics',
        inventory: {
            quantity: 60,
            lowStockThreshold: 8
        },
        specifications: {
            'Battery Life': '6+24 hours',
            'Connectivity': 'Bluetooth 5.1',
            'Water Resistance': 'IPX5',
            'Charging': 'Wireless charging case'
        },
        tags: ['wireless', 'earbuds', 'bluetooth', 'premium'],
        isFeatured: false,
        isActive: true
    },
    {
        name: 'Premium Phone Case',
        slug: 'premium-phone-case',
        description: 'Protective phone case with premium materials and elegant design.',
        shortDescription: 'Protective phone case with premium design',
        price: 49.99,
        comparePrice: 69.99,
        sku: 'CASE-001',
        images: ['/images/backpack.jpg'],
        category: 'Accessories',
        inventory: {
            quantity: 100,
            lowStockThreshold: 15
        },
        specifications: {
            'Material': 'Premium leather',
            'Protection': 'Drop protection up to 6ft',
            'Compatibility': 'Multiple phone models',
            'Features': 'Card holder'
        },
        tags: ['phone', 'case', 'protection', 'leather'],
        isFeatured: false,
        isActive: true
    }
];

const seedData = async () => {
    try {
        // Connect to database
        await connectDB();
        
        console.log('🌱 Starting database seed...');
        
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Product.deleteMany({});
        await Category.deleteMany({});
        
        // Create categories
        console.log('📁 Creating categories...');
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ Created ${createdCategories.length} categories`);
        
        // Update products with category ObjectIds
        const updatedProducts = products.map(product => {
            const category = createdCategories.find(cat => cat.name === product.category);
            return {
                ...product,
                category: category._id
            };
        });
        
        // Create products
        console.log('📦 Creating products...');
        const createdProducts = await Product.insertMany(updatedProducts);
        console.log(`✅ Created ${createdProducts.length} products`);
        
        console.log('🎉 Database seed completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Categories: ${createdCategories.length}`);
        console.log(`   Products: ${createdProducts.length}`);
        console.log(`   Featured Products: ${createdProducts.filter(p => p.isFeatured).length}`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('❌ Unhandled Promise Rejection:', err.message);
    process.exit(1);
});

// Run the seed function
seedData();
