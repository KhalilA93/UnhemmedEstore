import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading product with ID:', id);
      const response = await productAPI.getById(id);
      console.log('Product response:', response);
      
      if (response.data.success) {
        const productData = response.data.data;
        console.log('Product data:', productData);
        console.log('Product sizes:', productData.sizes);
        setProduct(productData);
        // Set default size if available
        if (productData.sizes && productData.sizes.length > 0) {
          const firstSize = productData.sizes[0];
          const defaultSize = typeof firstSize === 'string' ? firstSize : (firstSize.size || firstSize.name || firstSize.value);
          console.log('Setting default size:', defaultSize);
          setSelectedSize(defaultSize);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      if (err.response?.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to load product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      const result = await addToCart(product._id || product.id, quantity);
      if (result.success) {
        alert(`Added ${quantity} ${product.name}(s) to cart!`);
      } else {
        alert('Failed to add to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '3rem' }}>⚠️</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          {error}
        </h1>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
          <Button variant="secondary" onClick={loadProduct}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Product not found
        </h1>
        <Button onClick={() => navigate('/products')}>
          Browse Products
        </Button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[activeImageIndex] || { url: '/images/placeholder.svg', alt: product.name };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <button 
              onClick={() => navigate('/')}
              style={{ color: '#6b7280', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate('/products')}
              style={{ color: '#6b7280', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Products
            </button>
            {product.category && (
              <>
                <span>/</span>
                <button 
                  onClick={() => navigate(`/products?category=${product.category}`)}
                  style={{ color: '#6b7280', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {product.category}
                </button>
              </>
            )}
            <span>/</span>
            <span style={{ color: '#111827' }}>{product.name}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                aspectRatio: '1', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '0.5rem',
                overflow: 'hidden'
              }}>
                <img
                  src={currentImage.url}
                  alt={currentImage.alt}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.svg';
                  }}
                />
              </div>
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '0.375rem',
                      border: activeImageIndex === index ? '2px solid #0284c7' : '2px solid transparent',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category and Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              {product.category && (
                <span style={{ 
                  fontSize: '0.875rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  borderRadius: '1rem',
                  fontWeight: '500'
                }}>
                  {product.category}
                </span>
              )}
              {product.brand && (
                <span style={{ 
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  by {product.brand}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#111827',
              marginBottom: '1rem',
              lineHeight: '1.2'
            }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.ratings && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        color: i < Math.floor(product.ratings.average) ? '#fbbf24' : '#d1d5db',
                        fontSize: '1.25rem'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {product.ratings.average} ({product.ratings.count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: '#0284c7' 
                }}>
                  ${product.price?.toFixed(2)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span style={{ 
                    fontSize: '1.25rem', 
                    color: '#6b7280', 
                    textDecoration: 'line-through'
                  }}>
                    ${product.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.comparePrice && product.comparePrice > product.price && (
                <div style={{ color: '#059669', fontSize: '0.875rem', fontWeight: '500' }}>
                  Save ${(product.comparePrice - product.price).toFixed(2)} 
                  ({(((product.comparePrice - product.price) / product.comparePrice) * 100).toFixed(0)}% off)
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Description
              </h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Features
                </h3>
                <ul style={{ color: '#4b5563' }}>
                  {product.features.map((feature, index) => {
                    // Handle both string features and object features
                    const featureText = typeof feature === 'string' ? feature : (feature.name || feature.description || feature.value || `Feature ${index + 1}`);
                    return (
                      <li key={index} style={{ marginBottom: '0.25rem' }}>
                        • {featureText}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Size
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.sizes.map((size, index) => {
                    // Handle both string sizes and object sizes
                    const sizeValue = typeof size === 'string' ? size : (size.size || size.name || size.value || `Size ${index + 1}`);
                    const sizeKey = typeof size === 'string' ? size : (size._id || size.id || sizeValue);
                    
                    return (
                      <button
                        key={sizeKey}
                        onClick={() => setSelectedSize(sizeValue)}
                        style={{
                          padding: '0.5rem 1rem',
                          border: selectedSize === sizeValue ? '2px solid #0284c7' : '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          backgroundColor: selectedSize === sizeValue ? '#dbeafe' : 'white',
                          color: selectedSize === sizeValue ? '#0284c7' : '#4b5563',
                          cursor: 'pointer',
                          fontWeight: selectedSize === sizeValue ? '600' : '400',
                          transition: 'all 0.2s'
                        }}
                      >
                        {sizeValue}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                    Quantity
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}>
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      style={{
                        padding: '0.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '1.125rem'
                      }}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.5rem 1rem', fontWeight: '600' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      style={{
                        padding: '0.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '1.125rem'
                      }}
                      disabled={quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || (product.sizes?.length > 0 && !selectedSize)}
                style={{ 
                  width: '100%', 
                  fontSize: '1.125rem',
                  padding: '1rem'
                }}
              >
                {addingToCart ? 'Adding...' : `Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}`}
              </Button>
              
              {product.sizes?.length > 0 && !selectedSize && (
                <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Please select a size
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div style={{ 
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#059669', fontSize: '1.125rem' }}>✓</span>
                <span style={{ color: '#059669', fontWeight: '500' }}>In Stock</span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Ready to ship in 1-2 business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;