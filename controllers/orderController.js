const Order = require('../models/Order');
const Product = require('../models/Product');
const { mockProducts } = require('../data/mockProducts');

// Check if database is connected
const isDatabaseConnected = () => {
  return global.isDbConnected !== false;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice 
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Validate products exist and prices are correct
    let validatedItems = [];
    for (let item of orderItems) {
      let product;
      
      if (isDatabaseConnected()) {
        product = await Product.findById(item.product);
      } else {
        product = mockProducts.find(p => p.id === item.product || p._id === item.product);
      }
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      
      validatedItems.push({
        name: product.name,
        qty: item.qty,
        image: product.images[0]?.url || '/images/placeholder.svg',
        price: product.price,
        product: product._id || product.id
      });
    }

    if (isDatabaseConnected()) {
      const order = new Order({
        user: req.user._id,
        orderItems: validatedItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      });

      const createdOrder = await order.save();
      
      res.status(201).json({
        success: true,
        data: createdOrder
      });
    } else {
      // Demo mode - simulate order creation
      const simulatedOrder = {
        _id: Date.now().toString(),
        user: req.user._id || 'demo-user',
        orderItems: validatedItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date(),
        orderStatus: 'processing'
      };
      
      res.status(201).json({
        success: true,
        data: simulatedOrder,
        message: 'Order created (demo mode)'
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json({
        success: true,
        data: orders
      });
    } else {
      // Demo mode - return sample orders
      const sampleOrders = [
        {
          _id: '1',
          orderItems: [
            {
              name: "Men's Button-Up Shirt",
              qty: 1,
              price: 85.00,
              image: '/images/mens/StockSnap_AIOTY3A4AE.jpg'
            }
          ],
          totalPrice: 95.00,
          isPaid: true,
          isDelivered: false,
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          orderStatus: 'processing'
        }
      ];
      
      res.json({
        success: true,
        data: sampleOrders,
        message: 'Orders retrieved (demo mode)'
      });
    }
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const order = await Order.findOne({ 
        _id: req.params.id, 
        user: req.user._id 
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } else {
      // Demo mode
      const sampleOrder = {
        _id: req.params.id,
        orderItems: [
          {
            name: "Men's Button-Up Shirt",
            qty: 1,
            price: 85.00,
            image: '/images/mens/StockSnap_AIOTY3A4AE.jpg'
          }
        ],
        totalPrice: 95.00,
        isPaid: true,
        isDelivered: false,
        createdAt: new Date(),
        orderStatus: 'processing'
      };
      
      res.json({
        success: true,
        data: sampleOrder,
        message: 'Order retrieved (demo mode)'
      });
    }
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (isDatabaseConnected()) {
      const order = await Order.findOne({ 
        _id: req.params.id, 
        user: req.user._id 
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      order.orderStatus = status;
      await order.save();

      res.json({
        success: true,
        data: order
      });
    } else {
      // Demo mode
      res.json({
        success: true,
        message: `Order status updated to ${status} (demo mode)`
      });
    }
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const order = await Order.findOne({ 
        _id: req.params.id, 
        user: req.user._id 
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (order.orderStatus === 'delivered') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel delivered order'
        });
      }

      order.orderStatus = 'cancelled';
      await order.save();

      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    } else {
      // Demo mode
      res.json({
        success: true,
        message: 'Order cancelled (demo mode)'
      });
    }
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
};
