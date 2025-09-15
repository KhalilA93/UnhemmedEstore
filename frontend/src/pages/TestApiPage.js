import React, { useState } from 'react';
import { productAPI } from '../services/api';

const TestApiPage = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint) => {
    try {
      setLoading(true);
      setResult('Loading...');
      
      let response;
      switch (endpoint) {
        case 'featured':
          response = await productAPI.getFeatured();
          break;
        case 'all':
          response = await productAPI.getAll();
          break;
        case 'men':
          response = await productAPI.getByCategory('Men');
          break;
        case 'women':
          response = await productAPI.getByCategory('Women');
          break;
        default:
          response = await productAPI.getAll();
      }
      
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('API Test Error:', error);
      setResult(`Error: ${error.message}\nStack: ${error.stack}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>API Test Page</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => testEndpoint('featured')} disabled={loading}>
          Test Featured Products
        </button>
        <button onClick={() => testEndpoint('all')} disabled={loading}>
          Test All Products
        </button>
        <button onClick={() => testEndpoint('men')} disabled={loading}>
          Test Men's Products
        </button>
        <button onClick={() => testEndpoint('women')} disabled={loading}>
          Test Women's Products
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '0.5rem',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        <pre>{result || 'Click a button to test an API endpoint'}</pre>
      </div>
    </div>
  );
};

export default TestApiPage;
