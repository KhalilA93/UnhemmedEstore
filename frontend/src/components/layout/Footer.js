import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#111827', color: 'white' }}>
      <div className="container" style={{ padding: '3rem 0' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          gap: '3rem' 
        }}>
          {/* Company Info */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>Unhemmed</h3>
              <p style={{ marginTop: '0.5rem', color: '#9ca3af', maxWidth: '400px' }}>
                Your premier destination for high-quality, fashionable clothing. 
                We believe in style that speaks to your individuality.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <li>
                <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
