const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'cart.product',
        select: 'name price images sizes colors inventory status'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out any invalid cart items (products that may have been deleted)
    const validCartItems = user.cart.filter(item => item.product);

    // If any items were filtered out, update the user's cart
    if (validCartItems.length !== user.cart.length) {
      user.cart = validCartItems;
      await user.save();
    }

    // Calculate cart totals
    const cartSummary = {
      items: validCartItems,
      itemCount: user.cartItemsCount,
      subtotal: validCartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0),
      estimatedShipping: 0, // Will be calculated based on shipping method
      estimatedTax: 0, // Will be calculated based on address
      estimatedTotal: 0
    };

    // Basic shipping calculation (free over $50, otherwise $10)
    cartSummary.estimatedShipping = cartSummary.subtotal >= 50 ? 0 : 10;
    
    // Basic tax calculation (8% - should be based on shipping address)
    cartSummary.estimatedTax = cartSummary.subtotal * 0.08;
    
    cartSummary.estimatedTotal = cartSummary.subtotal + cartSummary.estimatedShipping + cartSummary.estimatedTax;

    res.json({
      success: true,
      data: cartSummary
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Check inventory if tracking is enabled
    if (product.inventory && product.inventory.trackQuantity) {
      if (product.inventory.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient inventory'
        });
      }
    }

    // Check if item already exists in cart with same attributes
    const existingItemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId && 
      item.size === size && 
      item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = user.cart[existingItemIndex].quantity + parseInt(quantity);
      
      // Check inventory for updated quantity
      if (product.inventory && product.inventory.trackQuantity) {
        if (product.inventory.quantity < newQuantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient inventory for requested quantity'
          });
        }
      }
      
      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity: parseInt(quantity),
        size,
        color,
        addedAt: new Date()
      });
    }

    await user.save();
    
    // Populate cart for response
    await user.populate({
      path: 'cart.product',
      select: 'name price images sizes colors'
    });

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item to cart'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Get product to check inventory
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cartItem.remove();
    } else {
      // Check inventory if tracking is enabled
      if (product.inventory && product.inventory.trackQuantity) {
        if (product.inventory.quantity < quantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient inventory for requested quantity'
          });
        }
      }
      
      cartItem.quantity = quantity;
    }

    await user.save();
    await user.populate({
      path: 'cart.product',
      select: 'name price images sizes colors'
    });

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: user.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    cartItem.remove();
    await user.save();
    await user.populate({
      path: 'cart.product',
      select: 'name price images sizes colors'
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing item from cart'
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
};

// @desc    Move item from cart to wishlist
// @route   POST /api/cart/move-to-wishlist/:itemId
// @access  Private
const moveToWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check if product already in wishlist
    const existingWishlistItem = user.wishlist.find(
      item => item.product.toString() === cartItem.product.toString()
    );

    if (!existingWishlistItem) {
      // Add to wishlist
      user.wishlist.push({
        product: cartItem.product,
        addedAt: new Date(),
        notes: `Moved from cart (Size: ${cartItem.size || 'N/A'}, Color: ${cartItem.color || 'N/A'})`
      });
    }

    // Remove from cart
    cartItem.remove();
    await user.save();

    await user.populate([
      {
        path: 'cart.product',
        select: 'name price images sizes colors'
      },
      {
        path: 'wishlist.product',
        select: 'name price images'
      }
    ]);

    res.json({
      success: true,
      message: 'Item moved to wishlist successfully',
      data: {
        cart: user.cart,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Move to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while moving item to wishlist'
    });
  }
};

// @desc    Apply coupon/discount code
// @route   POST /api/cart/apply-coupon
// @access  Private
const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    
    // This is a placeholder for coupon functionality
    // In a real implementation, you'd have a Coupon model and validation logic
    
    const validCoupons = {
      'WELCOME10': { type: 'percentage', value: 10, minOrder: 0 },
      'SAVE20': { type: 'percentage', value: 20, minOrder: 100 },
      'FREESHIP': { type: 'shipping', value: 0, minOrder: 0 },
      'FLAT15': { type: 'fixed', value: 15, minOrder: 50 }
    };

    const coupon = validCoupons[couponCode.toUpperCase()];
    
    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Get user's cart to calculate totals
    const user = await User.findById(req.user.id)
      .populate('cart.product', 'price');

    const subtotal = user.cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value for this coupon is $${coupon.minOrder}`
      });
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal);
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        couponCode: couponCode.toUpperCase(),
        discount,
        couponType: coupon.type,
        couponValue: coupon.value
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while applying coupon'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  moveToWishlist,
  applyCoupon
};