import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { productAPI } from '../../services/api';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const WishlistSection = () => {
  const { 
    wishlist, 
    wishlistLoading,
    addToCart, 
    removeFromWishlist, 
    loadWishlist 
  } = useApp();
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  useEffect(() => {
    if (wishlist.length > 0) {
      loadWishlistDetails();
    } else {
      setWishlistItems([]);
    }
  }, [wishlist]);

  const loadWishlistDetails = async () => {
    try {
      setIsLoading(true);
      const productPromises = wishlist.map(async (item) => {
        try {
          const response = await productAPI.getById(item.productId);
          return {
            ...item,
            product: response.data.product
          };
        } catch (error) {
          console.error(`Failed to load product ${item.productId}:`, error);
          return {
            ...item,
            product: null
          };
        }
      });
      
      const itemsWithProducts = await Promise.all(productPromises);
      setWishlistItems(itemsWithProducts.filter(item => item.product));
    } catch (error) {
      console.error('Failed to load wishlist details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId, productDetails) => {
    const result = await addToCart(productId, 1, productDetails);
    if (result.success) {
      // Optionally remove from wishlist after adding to cart
      // await removeFromWishlist(productId);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
    }
  };

  const calculateDiscount = (originalPrice, salePrice) => {
    if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  if (wishlistLoading || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="wishlist-section">
      <div className="section-header">
        <h2>My Wishlist</h2>
        <span className="wishlist-count">
          {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Save your favorite items to your wishlist so you can easily find them later.</p>
          <Button href="/products">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => {
            const product = item.product;
            const isOnSale = product.salePrice && product.salePrice < product.price;
            const discount = calculateDiscount(product.price, product.salePrice);
            
            return (
              <div key={item._id} className="wishlist-item">
                <div className="wishlist-item-image">
                  <img 
                    src={product.images?.[0] || '/images/placeholder.svg'} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.svg';
                    }}
                  />
                  {isOnSale && discount > 0 && (
                    <span className="discount-badge">-{discount}%</span>
                  )}
                  <button 
                    className="remove-from-wishlist"
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="wishlist-item-content">
                  <h4 className="product-name">
                    <a href={`/products/${product._id}`}>
                      {product.name}
                    </a>
                  </h4>
                  
                  <p className="product-description">
                    {product.description?.substring(0, 100)}
                    {product.description?.length > 100 && '...'}
                  </p>
                  
                  <div className="product-rating">
                    {product.rating > 0 && (
                      <>
                        <div className="rating-stars">
                          {[...Array(5)].map((_, index) => (
                            <span 
                              key={index}
                              className={index < Math.floor(product.rating) ? 'star filled' : 'star'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="rating-count">
                          ({product.reviewCount || 0} reviews)
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="product-price">
                    {isOnSale ? (
                      <div className="price-sale">
                        <span className="current-price">${product.salePrice.toFixed(2)}</span>
                        <span className="original-price">${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="current-price">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="product-availability">
                    {product.stock > 0 ? (
                      <span className="in-stock">✓ In Stock</span>
                    ) : (
                      <span className="out-of-stock">✗ Out of Stock</span>
                    )}
                  </div>
                  
                  <div className="wishlist-item-actions">
                    <Button
                      onClick={() => handleAddToCart(product._id, {
                        name: product.name,
                        price: product.salePrice || product.price,
                        images: product.images
                      })}
                      disabled={product.stock === 0}
                      className="add-to-cart-btn"
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      href={`/products/${product._id}`}
                      className="view-product-btn"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div className="wishlist-item-meta">
                  <span className="added-date">
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </span>
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="low-stock-warning">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {wishlistItems.length > 0 && (
        <div className="wishlist-actions">
          <div className="bulk-actions">
            <Button
              variant="outline"
              onClick={() => {
                const availableItems = wishlistItems.filter(item => item.product.stock > 0);
                availableItems.forEach(item => {
                  handleAddToCart(item.product._id, {
                    name: item.product.name,
                    price: item.product.salePrice || item.product.price,
                    images: item.product.images
                  });
                });
              }}
              disabled={wishlistItems.every(item => item.product.stock === 0)}
            >
              Add All to Cart
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                  wishlistItems.forEach(item => {
                    removeFromWishlist(item.productId);
                  });
                }
              }}
            >
              Clear Wishlist
            </Button>
          </div>
          
          <div className="wishlist-sharing">
            <Button
              variant="outline"
              onClick={() => {
                const url = `${window.location.origin}/wishlist/shared/${encodeURIComponent(btoa(wishlistItems.map(item => item.productId).join(',')))}`;
                navigator.clipboard.writeText(url);
                alert('Wishlist link copied to clipboard!');
              }}
            >
              Share Wishlist
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistSection;