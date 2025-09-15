import React from 'react';

const LoadingSpinner = ({ size = 'md', style = {} }) => {
  const sizes = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' },
    xl: { width: '4rem', height: '4rem' }
  };

  const spinnerStyles = {
    borderRadius: '50%',
    border: '2px solid #d1d5db',
    borderTopColor: '#0284c7',
    animation: 'spin 1s linear infinite',
    ...sizes[size],
    ...style
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div style={spinnerStyles}></div>
    </>
  );
};

export default LoadingSpinner;
