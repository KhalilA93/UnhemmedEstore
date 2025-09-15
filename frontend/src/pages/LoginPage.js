import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, isAuthenticated } = useApp();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      // Redirect will happen automatically via Navigate component
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 200px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem 0'
    }}>
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#6b7280' }}>
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              textAlign: 'center',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '3rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ 
                width: '100%',
                marginBottom: '1rem',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Don't have an account?{' '}
              <a 
                href="/register" 
                style={{ 
                  color: '#0284c7', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Sign up
              </a>
            </p>
            <a 
              href="/forgot-password" 
              style={{ 
                color: '#0284c7', 
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Demo Account Info */}
        <div className="card" style={{ padding: '1rem', marginTop: '1rem', backgroundColor: '#f0f9ff' }}>
          <p style={{ fontSize: '0.875rem', color: '#0369a1', textAlign: 'center', marginBottom: '0.5rem' }}>
            <strong>Demo Account:</strong>
          </p>
          <p style={{ fontSize: '0.75rem', color: '#075985', textAlign: 'center' }}>
            Email: demo@unhemmed.com<br />
            Password: demo123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
