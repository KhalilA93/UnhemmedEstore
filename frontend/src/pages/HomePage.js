import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useApp();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productAPI.getFeatured();
      
      // Handle different response structures
      if (response.data && response.data.success) {
        const products = response.data.data || response.data.products || [];
        setFeaturedProducts(products);
      } else if (Array.isArray(response.data)) {
        // Direct array response
        setFeaturedProducts(response.data);
      } else {
        throw new Error('API response has unexpected structure');
      }
    } catch (error) {
      // Fallback to empty array if API fails
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h1>
                Welcome to <span style={{ color: '#0284c7' }}>Unhemmed</span>
              </h1>
              <p>
                Discover the latest fashion trends with our curated collection of premium clothing and accessories.
              </p>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Link to="/products">
                  <Button 
                    size="lg" 
                    style={{ 
                      backgroundColor: 'white', 
                      color: '#0284c7',
                      width: 'auto'
                    }}
                  >
                    Shop Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    style={{ 
                      border: '2px solid white',
                      color: 'white',
                      backgroundColor: 'transparent',
                      width: 'auto'
                    }}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                backdropFilter: 'blur(4px)',
                padding: '1rem'
              }}>
                <img 
                  src="/images/hero/hero-banner.jpg" 
                  alt="Unhemmed Fashion" 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'contain', 
                    borderRadius: '0.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <div className="about-section-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div style={{ order: 2 }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src="/images/homepage/about-section.jpg" 
                  alt="Unhemmed Style" 
                  style={{ 
                    width: '100%', 
                    height: '24rem',
                    objectFit: 'cover', 
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                />
              </div>
            </div>
            <div style={{ order: 1 }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#111827', 
                marginBottom: '1.5rem',
                lineHeight: '1.2'
              }}>
                Redefining Fashion with <span style={{ color: '#0284c7' }}>Unhemmed</span>
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#6b7280', 
                marginBottom: '2rem',
                lineHeight: '1.7'
              }}>
                At Unhemmed, we believe fashion should be accessible, sustainable, and expressive. 
                Our carefully curated collections bring together contemporary design with timeless 
                elegance, ensuring you look and feel your best in every moment.
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#e0f2fe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem', color: '#0284c7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Premium Quality</h3>
                    <p style={{ color: '#6b7280' }}>Every piece is crafted with attention to detail and the finest materials.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#e0f2fe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem', color: '#0284c7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Sustainable Fashion</h3>
                    <p style={{ color: '#6b7280' }}>We're committed to ethical practices and environmental responsibility.</p>
                  </div>
                </div>
              </div>
              <Link to="/about">
                <Button size="lg">Learn More About Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f9fafb' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div style={{ 
                margin: '0 auto 1rem',
                height: '4rem',
                width: '4rem',
                backgroundColor: '#e0f2fe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ height: '2rem', width: '2rem', color: '#0284c7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Free Shipping</h3>
              <p style={{ color: '#6b7280' }}>Free shipping on orders over $50. Fast and reliable delivery.</p>
            </div>
            <div className="text-center">
              <div style={{ 
                margin: '0 auto 1rem',
                height: '4rem',
                width: '4rem',
                backgroundColor: '#e0f2fe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ height: '2rem', width: '2rem', color: '#0284c7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Quality Guarantee</h3>
              <p style={{ color: '#6b7280' }}>100% satisfaction guarantee. Premium quality materials and craftsmanship.</p>
            </div>
            <div className="text-center">
              <div style={{ 
                margin: '0 auto 1rem',
                height: '4rem',
                width: '4rem',
                backgroundColor: '#e0f2fe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ height: '2rem', width: '2rem', color: '#0284c7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>24/7 Support</h3>
              <p style={{ color: '#6b7280' }}>Round-the-clock customer support for all your shopping needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '1rem' 
            }}>
              Featured Products
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#6b7280', 
              maxWidth: '32rem', 
              margin: '0 auto' 
            }}>
              Handpicked items from our latest collection, chosen just for you.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {featuredProducts
              .filter(p => p.category === 'women').slice(0,2)
              .concat(featuredProducts.filter(p => p.category === 'men').slice(0,2))
              .map((product) => (
                <div 
                  key={product._id || product.id} 
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '420px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ 
                      position: 'relative',
                      overflow: 'hidden',
                      height: '220px',
                      background: '#f3f4f6'
                    }}>
                      <img
                        src={product.image || '/images/placeholder.svg'}
                        alt={product.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'
                        }
                        onError={e => { e.target.src = '/images/placeholder.svg'; }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        backgroundColor: product.category === 'women' ? '#ec4899' : '#3b82f6',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {product.category === 'women' ? "Women's" : "Men's"}
                      </div>
                    </div>
                  </Link>
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        fontSize: '1.15rem', 
                        marginBottom: '0.5rem',
                        color: '#111827',
                        lineHeight: '1.4'
                      }}>
                        {product.name}
                      </h3>
                    </Link>
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '0.95rem', 
                      marginBottom: '1.1rem',
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {product.description}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginTop: 'auto'
                    }}>
                      <span style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        color: '#0284c7' 
                      }}>
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product._id || product.id);
                        }}
                        style={{ 
                          transition: 'all 0.2s ease',
                          backgroundColor: '#0284c7',
                          border: 'none'
                        }}
                        onMouseEnter={e => {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.backgroundColor = '#0369a1';
                        }}
                        onMouseLeave={e => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.backgroundColor = '#0284c7';
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ 
        position: 'relative',
        backgroundColor: '#0284c7', 
        padding: '4rem 0',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}>
          <img 
            src="/images/homepage/feature-background.jpg" 
            alt="Newsletter Background" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              opacity: 0.3
            }}
          />
        </div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 132, 199, 0.8)',
          zIndex: 1
        }}></div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '1rem' 
          }}>
            Stay in the Loop
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#bae6fd', 
            marginBottom: '2rem',
            maxWidth: '32rem',
            margin: '0 auto 2rem'
          }}>
            Subscribe to our newsletter for the latest updates, exclusive offers, and fashion tips.
          </p>
          <div style={{ 
            maxWidth: '24rem', 
            margin: '0 auto',
            display: 'flex',
            gap: '1rem'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem'
              }}
            />
            <Button 
              style={{ 
                backgroundColor: 'white', 
                color: '#0284c7',
                padding: '0.75rem 2rem'
              }}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
