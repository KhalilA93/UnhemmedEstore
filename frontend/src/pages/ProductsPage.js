import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    loadProducts();
  }, [category, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading products with:', { category, search });
      
      let response;
      if (search) {
        console.log('Making search request:', search);
        response = await productAPI.search(search);
      } else if (category) {
        console.log('Making category request:', category);
        // Capitalize first letter to match backend expectations
        const categoryFormatted = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        response = await productAPI.getByCategory(categoryFormatted);
      } else {
        console.log('Making getAll request');
        response = await productAPI.getAll();
      }
      
      console.log('API Response:', response);
      
      if (response.data.success) {
        setProducts(response.data.data.products || response.data.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    if (search) return `Search results for "${search}"`;
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)}'s Products`;
    return 'All Products';
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ color: '#dc2626', marginBottom: '1rem' }}>⚠️ {error}</div>
        <button 
          onClick={loadProducts}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {getCategoryTitle()}
          </h1>
          <p style={{ color: '#6b7280' }}>
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id || product._id} className="card">
                <div style={{ aspectRatio: '1', backgroundColor: '#f3f4f6' }}>
                  <img
                    src={product.images?.[0]?.url || '/images/placeholder.svg'}
                    alt={product.images?.[0]?.alt || product.name}
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
                <div style={{ padding: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginBottom: '0.5rem' 
                  }}>
                    <span style={{ 
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '1rem',
                      fontWeight: '500'
                    }}>
                      {product.category}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f3f4f6',
                      color: '#4b5563',
                      borderRadius: '1rem'
                    }}>
                      {product.subcategory}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.name}
                  </h3>
                  
                  {product.brand && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280', 
                      marginBottom: '0.5rem' 
                    }}>
                      {product.brand}
                    </p>
                  )}
                  
                  <p style={{ 
                    color: '#4b5563', 
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.shortDescription || product.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <div>
                      <span style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        color: '#1f2937' 
                      }}>
                        ${product.price?.toFixed(2)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span style={{ 
                          fontSize: '0.875rem', 
                          color: '#6b7280', 
                          textDecoration: 'line-through',
                          marginLeft: '0.5rem'
                        }}>
                          ${product.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button 
                      className="btn-primary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                      onClick={() => {
                        // TODO: Implement add to cart functionality
                        console.log('Add to cart:', product.id || product._id);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              No products found
            </h3>
            <p style={{ color: '#6b7280' }}>
              Try adjusting your search or browse our categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
