const mongoose = require('mongoose');
const Product = require('../models/Product');
const mockProducts = require('../data/mockProducts');
require('dotenv').config();

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products`);

    // Insert mock products
    const insertedProducts = await Product.insertMany(mockProducts);
    console.log(`Successfully seeded ${insertedProducts.length} products:`);
    
    // Log summary by category
    const menProducts = insertedProducts.filter(p => p.category === 'Men');
    const womenProducts = insertedProducts.filter(p => p.category === 'Women');
    
    console.log(`- Men's clothing: ${menProducts.length} products`);
    console.log(`- Women's clothing: ${womenProducts.length} products`);
    
    console.log('\nProducts by subcategory:');
    const subcategories = {};
    insertedProducts.forEach(product => {
      const key = `${product.category} - ${product.subcategory}`;
      subcategories[key] = (subcategories[key] || 0) + 1;
    });
    
    Object.entries(subcategories).forEach(([key, count]) => {
      console.log(`- ${key}: ${count} products`);
    });

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// Run the seeding function
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;
