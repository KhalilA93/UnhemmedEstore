import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  style = {},
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    outline: 'none',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    ...style
  };

  const variants = {
    primary: {
      backgroundColor: '#0284c7',
      color: 'white'
    },
    secondary: {
      backgroundColor: '#e5e7eb',
      color: '#111827'
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#374151',
      border: '1px solid #d1d5db'
    },
    danger: {
      backgroundColor: '#dc2626',
      color: 'white'
    }
  };

  const sizes = {
    sm: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem'
    },
    md: {
      padding: '0.5rem 1rem',
      fontSize: '1rem'
    },
    lg: {
      padding: '0.75rem 1.5rem',
      fontSize: '1.125rem'
    }
  };

  const isDisabled = disabled || loading;
  
  const buttonStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size]
  };

  const handleMouseEnter = (e) => {
    if (!isDisabled) {
      if (variant === 'primary') {
        e.target.style.backgroundColor = '#0369a1';
      } else if (variant === 'secondary') {
        e.target.style.backgroundColor = '#d1d5db';
      } else if (variant === 'outline') {
        e.target.style.backgroundColor = '#f9fafb';
      } else if (variant === 'danger') {
        e.target.style.backgroundColor = '#b91c1c';
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!isDisabled) {
      if (variant === 'primary') {
        e.target.style.backgroundColor = '#0284c7';
      } else if (variant === 'secondary') {
        e.target.style.backgroundColor = '#e5e7eb';
      } else if (variant === 'outline') {
        e.target.style.backgroundColor = 'transparent';
      } else if (variant === 'danger') {
        e.target.style.backgroundColor = '#dc2626';
      }
    }
  };

  return (
    <button
      style={buttonStyles}
      disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {loading && (
        <div style={{ marginRight: '0.5rem' }}>
          <LoadingSpinner size="sm" />
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
