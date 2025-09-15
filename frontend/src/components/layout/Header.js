import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, cartCount, logout } = useApp();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Men', href: '/products?category=men' },
    { name: 'Women', href: '/products?category=women' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <header>
      <nav>
        <div className="nav-content">
          {/* Logo */}
          <div>
            <Link to="/" className="logo">
              Unhemmed
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="nav-icons">
            {/* Cart */}
            <Link to="/cart" className="cart-icon">
              <ShoppingCartIcon style={{ height: '1.5rem', width: '1.5rem' }} />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link 
                  to="/profile" 
                  className="nav-link"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <UserIcon style={{ height: '1.5rem', width: '1.5rem' }} />
                  <span className="hidden md:block">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="nav-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  className="nav-link"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: '0.5rem',
                cursor: 'pointer',
                color: '#374151'
              }}
            >
              {mobileMenuOpen ? (
                <XMarkIcon style={{ height: '1.5rem', width: '1.5rem' }} />
              ) : (
                <Bars3Icon style={{ height: '1.5rem', width: '1.5rem' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ 
            padding: '1rem 0', 
            borderTop: '1px solid #e5e7eb',
            display: 'block'
          }} className="md:hidden">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ 
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    display: 'block'
                  }}
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ 
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      display: 'block'
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ 
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      display: 'block'
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
