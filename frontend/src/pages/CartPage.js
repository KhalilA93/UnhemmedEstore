import React from 'react';
import { useApp } from '../context/AppContext';

const CartPage = () => {
  const { cart, cartCount, removeFromCart } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

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
          <a href="/products" className="btn-primary">
            Continue Shopping
          </a>
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
              {cart.map((item) => (
                <div key={item.productId} className="card" style={{ padding: '1.5rem' }}>
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
                      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                        Quantity: {item.quantity}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          style={{
                            color: '#dc2626',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            textDecoration: 'underline'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              
              <a 
                href="/products" 
                className="btn-secondary"
                style={{ 
                  width: '100%', 
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
