const mongoose = require('mongoose');

// Constants for validation and configuration
const PRODUCT_CONSTANTS = {
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 2000,
  SHORT_DESCRIPTION_MAX_LENGTH: 200,
  MIN_PRICE: 0,
  DEFAULT_LOW_STOCK_THRESHOLD: 10,
  MAX_RATING: 5,
  MIN_RATING: 0
};

const PRODUCT_CATEGORIES = ['Men', 'Women'];
const PRODUCT_SUBCATEGORIES = ['Shirts', 'Pants', 'Dresses', 'Jackets', 'Shoes', 'Accessories', 'Sets'];
const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36', '38', '40', '42', '6', '7', '8', '9', '10', '11', '12', 'One Size'];
const PRODUCT_STATUSES = ['active', 'inactive', 'draft', 'archived'];
const WEIGHT_UNITS = ['g', 'kg', 'oz', 'lb'];
const DIMENSION_UNITS = ['cm', 'in'];

// Image subdocument schema
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  alt: {
    type: String,
    required: [true, 'Image alt text is required'],
    trim: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  }
});

// Size subdocument schema
const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: PRODUCT_SIZES
  },
  quantity: {
    type: Number,
    required: [true, 'Size quantity is required'],
    min: [0, 'Size quantity cannot be negative'],
    default: 0
  }
});

// Color subdocument schema
const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Color name is required'],
    trim: true
  },
  hex: {
    type: String,
    required: [true, 'Color hex code is required'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code']
  },
  quantity: {
    type: Number,
    required: [true, 'Color quantity is required'],
    min: [0, 'Color quantity cannot be negative'],
    default: 0
  }
});

// Specification subdocument schema
const specificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Specification name is required'],
    trim: true
  },
  value: {
    type: String,
    required: [true, 'Specification value is required'],
    trim: true
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [PRODUCT_CONSTANTS.NAME_MAX_LENGTH, `Product name cannot exceed ${PRODUCT_CONSTANTS.NAME_MAX_LENGTH} characters`],
    index: 'text'
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxLength: [PRODUCT_CONSTANTS.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${PRODUCT_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`],
    index: 'text'
  },
  shortDescription: {
    type: String,
    maxLength: [PRODUCT_CONSTANTS.SHORT_DESCRIPTION_MAX_LENGTH, `Short description cannot exceed ${PRODUCT_CONSTANTS.SHORT_DESCRIPTION_MAX_LENGTH} characters`],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [PRODUCT_CONSTANTS.MIN_PRICE, 'Price cannot be negative'],
    index: true
  },
  comparePrice: {
    type: Number,
    min: [PRODUCT_CONSTANTS.MIN_PRICE, 'Compare price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: PRODUCT_CATEGORIES,
    index: true
  },
  subcategory: {
    type: String,
    required: [true, 'Product subcategory is required'],
    enum: PRODUCT_SUBCATEGORIES,
    trim: true
  },
  brand: {
    type: String,
    trim: true,
    index: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  
  // Nested schemas
  images: {
    type: [imageSchema],
    validate: {
      validator: (images) => images && images.length > 0,
      message: 'At least one product image is required'
    }
  },
  sizes: [sizeSchema],
  colors: [colorSchema],
  specifications: [specificationSchema],
  
  // Simple arrays
  features: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Inventory management
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'Inventory quantity is required'],
      min: [0, 'Inventory cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: PRODUCT_CONSTANTS.DEFAULT_LOW_STOCK_THRESHOLD,
      min: [0, 'Low stock threshold cannot be negative']
    },
    trackQuantity: {
      type: Boolean,
      default: true
    }
  },
  
  // Physical properties
  weight: {
    value: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    unit: {
      type: String,
      enum: WEIGHT_UNITS,
      default: 'kg'
    }
  },
  dimensions: {
    length: {
      type: Number,
      min: [0, 'Length cannot be negative']
    },
    width: {
      type: Number,
      min: [0, 'Width cannot be negative']
    },
    height: {
      type: Number,
      min: [0, 'Height cannot be negative']
    },
    unit: {
      type: String,
      enum: DIMENSION_UNITS,
      default: 'cm'
    }
  },
  
  // SEO and metadata
  seo: {
    metaTitle: {
      type: String,
      trim: true
    },
    metaDescription: {
      type: String,
      trim: true
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }]
  },
  
  // Product status and features
  status: {
    type: String,
    enum: PRODUCT_STATUSES,
    default: 'active',
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Ratings and reviews
  ratings: {
    average: {
      type: Number,
      min: [PRODUCT_CONSTANTS.MIN_RATING, 'Rating cannot be less than 0'],
      max: [PRODUCT_CONSTANTS.MAX_RATING, 'Rating cannot be more than 5'],
      default: 0,
      index: -1
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for optimized queries
productSchema.index({ name: 'text', description: 'text', 'seo.keywords': 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ category: 1, subcategory: 1, status: 1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ price: 1, status: 1 });
productSchema.index({ 'ratings.average': -1, status: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ brand: 1, status: 1 });

// Virtual properties
productSchema.virtual('primaryImage').get(function() {
  if (!this.images || this.images.length === 0) {
    return { url: '/images/placeholder.jpg', alt: 'Product image' };
  }
  
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || this.images[0];
});

productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

productSchema.virtual('stockStatus').get(function() {
  if (!this.inventory.trackQuantity) return 'in-stock';
  if (this.inventory.quantity <= 0) return 'out-of-stock';
  if (this.inventory.quantity <= this.inventory.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

productSchema.virtual('isOnSale').get(function() {
  return this.comparePrice && this.comparePrice > this.price;
});

productSchema.virtual('totalSizeQuantity').get(function() {
  return this.sizes.reduce((total, size) => total + size.quantity, 0);
});

productSchema.virtual('totalColorQuantity').get(function() {
  return this.colors.reduce((total, color) => total + color.quantity, 0);
});

productSchema.virtual('availableSizes').get(function() {
  return this.sizes.filter(size => size.quantity > 0).map(size => size.size);
});

productSchema.virtual('availableColors').get(function() {
  return this.colors.filter(color => color.quantity > 0);
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  try {
    // Ensure SKU is uppercase
    if (this.sku) {
      this.sku = this.sku.toUpperCase();
    }
    
    // Ensure only one primary image
    this.ensureSinglePrimaryImage();
    
    // Generate meta title if not provided
    if (!this.seo.metaTitle) {
      this.seo.metaTitle = this.name;
    }
    
    // Generate meta description if not provided
    if (!this.seo.metaDescription && this.shortDescription) {
      this.seo.metaDescription = this.shortDescription;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
productSchema.methods.ensureSinglePrimaryImage = function() {
  if (!this.images || this.images.length === 0) return;
  
  const primaryImages = this.images.filter(img => img.isPrimary);
  
  if (primaryImages.length === 0) {
    // Set first image as primary
    this.images[0].isPrimary = true;
  } else if (primaryImages.length > 1) {
    // Keep only the first one as primary
    this.images.forEach((img, index) => {
      img.isPrimary = index === 0;
    });
  }
};

productSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.ratings.average * this.ratings.count;
  this.ratings.count += 1;
  this.ratings.average = (currentTotal + newRating) / this.ratings.count;
  return this.save();
};

productSchema.methods.addImages = function(newImages) {
  if (!Array.isArray(newImages)) {
    newImages = [newImages];
  }
  
  this.images.push(...newImages);
  this.ensureSinglePrimaryImage();
  return this.save();
};

productSchema.methods.removeImage = function(imageId) {
  this.images = this.images.filter(img => img._id.toString() !== imageId.toString());
  this.ensureSinglePrimaryImage();
  return this.save();
};

productSchema.methods.setPrimaryImage = function(imageId) {
  this.images.forEach(img => {
    img.isPrimary = img._id.toString() === imageId.toString();
  });
  return this.save();
};

productSchema.methods.updateInventory = function(quantity, operation = 'set') {
  switch (operation) {
    case 'add':
      this.inventory.quantity += quantity;
      break;
    case 'subtract':
      this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
      break;
    case 'set':
    default:
      this.inventory.quantity = Math.max(0, quantity);
      break;
  }
  return this.save();
};

productSchema.methods.isAvailable = function() {
  return this.status === 'active' && 
         (!this.inventory.trackQuantity || this.inventory.quantity > 0);
};

productSchema.methods.canPurchase = function(requestedQuantity = 1) {
  if (this.status !== 'active') return false;
  if (!this.inventory.trackQuantity) return true;
  return this.inventory.quantity >= requestedQuantity;
};

// Static methods
productSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

productSchema.statics.findFeatured = function() {
  return this.find({ status: 'active', featured: true });
};

productSchema.statics.findByCategory = function(category) {
  return this.find({ status: 'active', category });
};

productSchema.statics.findInPriceRange = function(minPrice, maxPrice) {
  const query = { status: 'active' };
  if (minPrice !== undefined) query.price = { $gte: minPrice };
  if (maxPrice !== undefined) {
    query.price = query.price ? { ...query.price, $lte: maxPrice } : { $lte: maxPrice };
  }
  return this.find(query);
};

productSchema.statics.searchProducts = function(searchTerm) {
  return this.find({
    status: 'active',
    $text: { $search: searchTerm }
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Product', productSchema);
