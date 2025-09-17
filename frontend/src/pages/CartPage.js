import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { 
    cart, 
    cartCount, 
    updateCartQuantity, 
    removeFromCart, 
    moveToWishlist,
    isAuthenticated,
    loading 
  } = useApp();
  
  const [processingItems, setProcessingItems] = useState(new Set());

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setProcessingItems(prev => new Set(prev).add(productId));
    try {
      await updateCartQuantity(productId, newQuantity);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    setProcessingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromCart(productId);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleMoveToWishlist = async (productId) => {
    if (!isAuthenticated) {
      alert('Please log in to use the wishlist feature');
      return;
    }
    
    setProcessingItems(prev => new Set(prev).add(productId));
    try {
      await moveToWishlist(productId);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 200px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1rem' 
        }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div style={{ padding: '4rem 0' }}>
        <div className="container text-center">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Your cart is empty
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Shopping Cart ({cartCount} item{cartCount !== 1 ? 's' : ''})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item) => {
                const isProcessing = processingItems.has(item.productId);
                
                return (
                  <div 
                    key={item.productId} 
                    className="card" 
                    style={{ 
                      padding: '1.5rem',
                      opacity: isProcessing ? 0.6 : 1,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.5rem',
                        flexShrink: 0
                      }}>
                        <img
                          src={item.image || '/images/placeholder.svg'}
                          alt={item.name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            borderRadius: '0.5rem'
                          }}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.svg';
                          }}
                        />
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          {item.name}
                        </h3>
                        
                        {item.selectedSize && (
                          <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Size: {item.selectedSize}
                          </p>
                        )}
                        
                        {item.selectedColor && (
                          <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Color: {item.selectedColor}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '1rem', 
                          marginBottom: '1rem' 
                        }}>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Quantity:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              disabled={isProcessing || item.quantity <= 1}
                              style={{
                                width: '2rem',
                                height: '2rem',
                                backgroundColor: '#f3f4f6',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.25rem',
                                cursor: isProcessing || item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: isProcessing || item.quantity <= 1 ? 0.5 : 1
                              }}
                            >
                              -
                            </button>
                            <span style={{ 
                              minWidth: '2rem', 
                              textAlign: 'center',
                              fontWeight: '500'
                            }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              disabled={isProcessing}
                              style={{
                                width: '2rem',
                                height: '2rem',
                                backgroundColor: '#f3f4f6',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.25rem',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: isProcessing ? 0.5 : 1
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center' 
                        }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            {isAuthenticated && (
                              <button
                                onClick={() => handleMoveToWishlist(item.productId)}
                                disabled={isProcessing}
                                style={{
                                  color: '#3b82f6',
                                  background: 'none',
                                  border: 'none',
                                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                                  fontSize: '0.875rem',
                                  textDecoration: 'underline',
                                  opacity: isProcessing ? 0.5 : 1
                                }}
                              >
                                Move to Wishlist
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              disabled={isProcessing}
                              style={{
                                color: '#dc2626',
                                background: 'none',
                                border: 'none',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                textDecoration: 'underline',
                                opacity: isProcessing ? 0.5 : 1
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Order Summary
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p style={{ fontSize: '0.875rem', color: '#059669' }}>
                    🎉 You qualify for free shipping!
                  </p>
                )}
                {subtotal < 50 && subtotal > 0 && (
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold' 
                }}>
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {!isAuthenticated && (
                <div style={{ 
                  backgroundColor: '#fef3c7', 
                  padding: '1rem', 
                  borderRadius: '0.5rem', 
                  marginBottom: '1rem',
                  border: '1px solid #fbbf24'
                }}>
                  <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                    <Link to="/login" style={{ color: '#92400e', textDecoration: 'underline' }}>
                      Sign in
                    </Link> to save your cart and track your order.
                  </p>
                </div>
              )}

              <button 
                className="btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
                onClick={() => {
                  // TODO: Implement checkout
                  alert('Checkout functionality coming soon!');
                }}
              >
                Proceed to Checkout
              </button>
              
              <Link 
                to="/products" 
                className="btn-secondary"
                style={{ 
                  width: '100%', 
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
