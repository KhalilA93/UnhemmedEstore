const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    image: String,
    sku: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: String,
    color: String,
    total: {
      type: Number,
      required: true
    },
    // For returns/exchanges
    returned: {
      type: Boolean,
      default: false
    },
    returnedQuantity: {
      type: Number,
      default: 0
    },
    returnReason: String
  }],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String
  },
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    couponCode: String,
    total: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'apple_pay', 'google_pay', 'cash_on_delivery'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: String,
    paymentIntentId: String, // For Stripe
    refundId: String,
    refundAmount: Number,
    paidAt: Date,
    refundedAt: Date
  },
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight', 'pickup', 'same_day'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0
    },
    trackingNumber: String,
    carrier: {
      type: String,
      enum: ['fedex', 'ups', 'usps', 'dhl', 'other']
    },
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippedAt: Date,
    deliveryInstructions: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: String,
      enum: ['system', 'customer', 'admin'],
      default: 'system'
    }
  }],
  // Customer communication
  notes: String,
  customerNotes: String,
  adminNotes: String,
  
  // Reviews and feedback
  reviewed: {
    type: Boolean,
    default: false
  },
  reviewRequestSent: {
    type: Boolean,
    default: false
  },
  
  // Return/Exchange information
  returnEligible: {
    type: Boolean,
    default: true
  },
  returnWindow: {
    type: Date
  },
  
  // Order source
  source: {
    type: String,
    enum: ['web', 'mobile_app', 'phone', 'admin'],
    default: 'web'
  },
  
  // Marketing
  campaign: String,
  referralSource: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for can be cancelled
orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual for can be returned
orderSchema.virtual('canBeReturned').get(function() {
  return this.status === 'delivered' && 
         this.returnEligible && 
         this.returnWindow && 
         new Date() <= this.returnWindow;
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp.slice(-6)}${random}`;
  }
  
  // Set return window (30 days from delivery)
  if (this.status === 'delivered' && !this.returnWindow) {
    this.returnWindow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status changed to ${this.status}`,
      updatedBy: 'system'
    });
  }
  next();
});

// Method to update status with history
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy = 'system') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Status changed to ${newStatus}`,
    updatedBy
  });
  
  // Update timestamps based on status
  if (newStatus === 'shipped' && !this.shipping.shippedAt) {
    this.shipping.shippedAt = new Date();
  }
  if (newStatus === 'delivered' && !this.shipping.actualDelivery) {
    this.shipping.actualDelivery = new Date();
  }
  if (newStatus === 'completed' && !this.payment.paidAt) {
    this.payment.paidAt = new Date();
  }
};

// Method to calculate refund amount
orderSchema.methods.calculateRefund = function(itemsToRefund = []) {
  if (itemsToRefund.length === 0) {
    return this.pricing.total;
  }
  
  let refundAmount = 0;
  itemsToRefund.forEach(refundItem => {
    const orderItem = this.items.find(item => 
      item._id.toString() === refundItem.itemId
    );
    if (orderItem) {
      const itemRefundAmount = (orderItem.price * refundItem.quantity);
      refundAmount += itemRefundAmount;
    }
  });
  
  return refundAmount;
};

// Indexes for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shipping.trackingNumber': 1 });

module.exports = mongoose.model('Order', orderSchema);
