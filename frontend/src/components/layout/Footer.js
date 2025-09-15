import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#111827', color: 'white' }}>
      <div className="container" style={{ padding: '3rem 0' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>Unhemmed</h3>
              <p style={{ marginTop: '0.5rem', color: '#9ca3af' }}>
                Your premier destination for high-quality, fashionable clothing. 
                We believe in style that speaks to your individuality.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                <span style={{ position: 'absolute', left: '-9999px' }}>Facebook</span>
                <svg style={{ height: '1.5rem', width: '1.5rem' }} fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                <span style={{ position: 'absolute', left: '-9999px' }}>Instagram</span>
                <svg style={{ height: '1.5rem', width: '1.5rem' }} fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.751 14.16c.594.594 1.297.891 2.079.891.782 0 1.485-.297 2.079-.891l1.63 1.531c-.88.807-2.031 1.297-3.328 1.297-.297-.001-.594-.001-.762-.001z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                <span style={{ position: 'absolute', left: '-9999px' }}>Twitter</span>
                <svg style={{ height: '1.5rem', width: '1.5rem' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/products" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Products
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  About Us
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Customer Service</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/orders" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Track Order
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/returns" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Returns & Exchanges
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/shipping" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Shipping Info
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/faq" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #374151',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © 2025 Unhemmed. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link to="/terms" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link to="/cookies" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none' }}>
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
