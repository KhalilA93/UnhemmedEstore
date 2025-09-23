import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, loading, error, isAuthenticated, clearError } = useApp();
  const location = useLocation();

  // Check for verification success message
  const urlParams = new URLSearchParams(location.search);
  const verificationSuccess = urlParams.get('verified') === 'true';
  const verificationError = urlParams.get('verification') === 'failed';

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      // Redirect will happen automatically via Navigate component
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage('Please enter your email address');
      return;
    }

    try {
      setForgotPasswordLoading(true);
      setForgotPasswordMessage('');
      await authAPI.forgotPassword(forgotPasswordEmail);
      setForgotPasswordMessage('Password reset link sent to your email!');
    } catch (error) {
      setForgotPasswordMessage(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setForgotPasswordMode(false);
    setForgotPasswordEmail('');
    setForgotPasswordMessage('');
  };

  if (forgotPasswordMode) {
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
                Reset Password
              </h1>
              <p style={{ color: '#6b7280' }}>
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            {forgotPasswordMessage && (
              <div style={{
                backgroundColor: forgotPasswordMessage.includes('sent') ? '#f0fdf4' : '#fef2f2',
                color: forgotPasswordMessage.includes('sent') ? '#166534' : '#dc2626',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                textAlign: 'center',
                border: `1px solid ${forgotPasswordMessage.includes('sent') ? '#bbf7d0' : '#fecaca'}`
              }}>
                {forgotPasswordMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="forgotEmail" 
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
                  id="forgotEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your email address"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={resetForgotPassword}
                  style={{ 
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="btn-primary"
                  style={{ 
                    flex: 1,
                    opacity: forgotPasswordLoading ? 0.6 : 1,
                    cursor: forgotPasswordLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Verification Success Message */}
          {verificationSuccess && (
            <div style={{
              backgroundColor: '#f0fdf4',
              color: '#166534',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              textAlign: 'center',
              border: '1px solid #bbf7d0'
            }}>
              ✅ Email verified successfully! You can now log in.
            </div>
          )}

          {/* Verification Error Message */}
          {verificationError && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              textAlign: 'center',
              border: '1px solid #fecaca'
            }}>
              ❌ Email verification failed or link expired. Please request a new verification email.
            </div>
          )}

          {/* Login Error Message */}
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

            <div style={{ marginBottom: '1rem' }}>
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

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ margin: 0 }}
                />
                Remember me
              </label>
              
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Forgot password?
              </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
