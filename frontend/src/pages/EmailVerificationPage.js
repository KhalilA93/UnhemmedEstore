import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const EmailVerificationPage = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'resend'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract token from URL
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('resend');
      setMessage('No verification token found. Please enter your email to resend verification.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      setStatus('verifying');
      const response = await authAPI.verifyEmail(verificationToken);
      setStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
      
      // Redirect to login with success message after 3 seconds
      setTimeout(() => {
        navigate('/login?verified=true');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Email verification failed. The link may be expired or invalid.');
    }
  };

  const resendVerification = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await authAPI.resendVerification(email);
      setMessage('Verification email sent! Please check your inbox and spam folder.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              animation: 'spin 2s linear infinite'
            }}>
              ⏳
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Verifying Your Email
            </h1>
            <p style={{ color: '#6b7280' }}>
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Email Verified Successfully!
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {message}
            </p>
            <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.875rem' }}>
              You will be redirected to the login page in a few seconds.
            </p>
            <button 
              onClick={() => navigate('/login?verified=true')}
              className="btn-primary"
            >
              Go to Login Now
            </button>
          </div>
        );

      case 'error':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Verification Failed
            </h1>
            <p style={{ color: '#dc2626', marginBottom: '2rem' }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setStatus('resend')}
                className="btn-primary"
              >
                Resend Verification
              </button>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        );

      case 'resend':
        return (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Resend Email Verification
              </h1>
              <p style={{ color: '#6b7280' }}>
                Enter your email address and we'll send you a new verification link
              </p>
            </div>

            {message && (
              <div style={{
                backgroundColor: message.includes('sent') ? '#f0fdf4' : '#fef2f2',
                color: message.includes('sent') ? '#166534' : '#dc2626',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                textAlign: 'center',
                border: `1px solid ${message.includes('sent') ? '#bbf7d0' : '#fecaca'}`
              }}>
                {message}
              </div>
            )}

            <form onSubmit={resendVerification}>
              <div style={{ marginBottom: '1.5rem' }}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onClick={() => navigate('/login')}
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
                  disabled={loading}
                  className="btn-primary"
                  style={{ 
                    flex: 1,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Sending...' : 'Send Verification'}
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
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
          {renderContent()}
        </div>
        
        {/* Additional help text */}
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#0369a1', margin: '0' }}>
            <strong>Didn't receive the email?</strong><br />
            Check your spam folder or contact support if you continue to have issues.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EmailVerificationPage;