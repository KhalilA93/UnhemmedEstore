import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authAPI } from '../../services/api';
import Button from '../common/Button';

const SecuritySettings = () => {
  const { user, loading } = useApp();
  const [activeSection, setActiveSection] = useState('password');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setIsUpdating(true);
      const response = await authAPI.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.data.success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Password updated successfully!');
      }
    } catch (error) {
      setPasswordErrors({
        currentPassword: error.response?.data?.message || 'Failed to update password'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await authAPI.resendVerification(user.email);
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      alert('Failed to send verification email. Please try again later.');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const sections = [
    { id: 'password', label: 'Change Password', icon: '🔑' },
    { id: 'security', label: 'Security Info', icon: '🛡️' },
    { id: 'verification', label: 'Email Verification', icon: '📧' }
  ];

  return (
    <div className="security-settings">
      <div className="section-header">
        <h2>Security Settings</h2>
        <p>Manage your account security and privacy settings</p>
      </div>

      <div className="security-tabs">
        {sections.map(section => (
          <button
            key={section.id}
            className={`security-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="tab-icon">{section.icon}</span>
            <span className="tab-label">{section.label}</span>
          </button>
        ))}
      </div>

      <div className="security-content">
        {activeSection === 'password' && (
          <div className="password-section">
            <h3>Change Password</h3>
            <p>Choose a strong password that you haven't used before.</p>
            
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password *</label>
                <div className="password-input-group">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.currentPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <span className="error-text">{passwordErrors.currentPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password *</label>
                <div className="password-input-group">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <span className="error-text">{passwordErrors.newPassword}</span>
                )}
                <div className="password-requirements">
                  <p>Password must contain:</p>
                  <ul>
                    <li className={passwordForm.newPassword.length >= 8 ? 'valid' : ''}>
                      At least 8 characters
                    </li>
                    <li className={/(?=.*[a-z])/.test(passwordForm.newPassword) ? 'valid' : ''}>
                      One lowercase letter
                    </li>
                    <li className={/(?=.*[A-Z])/.test(passwordForm.newPassword) ? 'valid' : ''}>
                      One uppercase letter
                    </li>
                    <li className={/(?=.*\d)/.test(passwordForm.newPassword) ? 'valid' : ''}>
                      One number
                    </li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password *</label>
                <div className="password-input-group">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <span className="error-text">{passwordErrors.confirmPassword}</span>
                )}
              </div>

              <div className="form-actions">
                <Button type="submit" loading={isUpdating}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="security-info-section">
            <h3>Security Information</h3>
            
            <div className="security-stats">
              <div className="security-stat">
                <span className="stat-label">Account Created:</span>
                <span className="stat-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              <div className="security-stat">
                <span className="stat-label">Last Login:</span>
                <span className="stat-value">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                </span>
              </div>
              
              <div className="security-stat">
                <span className="stat-label">Password Last Changed:</span>
                <span className="stat-value">
                  {user?.passwordChangedAt ? new Date(user.passwordChangedAt).toLocaleDateString() : 'Never'}
                </span>
              </div>
              
              <div className="security-stat">
                <span className="stat-label">Failed Login Attempts:</span>
                <span className="stat-value">
                  {user?.security?.loginAttempts || 0}
                </span>
              </div>
              
              {user?.security?.isLocked && (
                <div className="security-stat warning">
                  <span className="stat-label">Account Status:</span>
                  <span className="stat-value">Temporarily Locked</span>
                </div>
              )}
            </div>

            <div className="security-recommendations">
              <h4>Security Recommendations</h4>
              <div className="recommendations-list">
                <div className={`recommendation ${user?.emailVerified ? 'completed' : 'pending'}`}>
                  <span className="recommendation-icon">
                    {user?.emailVerified ? '✅' : '⚠️'}
                  </span>
                  <div className="recommendation-content">
                    <h5>Verify your email address</h5>
                    <p>Ensure you can recover your account if needed.</p>
                  </div>
                </div>
                
                <div className={`recommendation ${user?.phone ? 'completed' : 'pending'}`}>
                  <span className="recommendation-icon">
                    {user?.phone ? '✅' : '⚠️'}
                  </span>
                  <div className="recommendation-content">
                    <h5>Add a phone number</h5>
                    <p>Provide an additional way to secure your account.</p>
                  </div>
                </div>
                
                <div className="recommendation pending">
                  <span className="recommendation-icon">🔐</span>
                  <div className="recommendation-content">
                    <h5>Use a strong password</h5>
                    <p>Regular password updates help keep your account secure.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'verification' && (
          <div className="verification-section">
            <h3>Email Verification</h3>
            
            <div className="verification-status">
              <div className={`status-indicator ${user?.emailVerified ? 'verified' : 'unverified'}`}>
                <span className="status-icon">
                  {user?.emailVerified ? '✅' : '⚠️'}
                </span>
                <div className="status-content">
                  <h4>
                    {user?.emailVerified ? 'Email Verified' : 'Email Not Verified'}
                  </h4>
                  <p>
                    {user?.emailVerified 
                      ? 'Your email address has been verified and is secure.'
                      : 'Please verify your email address to secure your account and receive important notifications.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {!user?.emailVerified && (
              <div className="verification-actions">
                <p>We sent a verification email to <strong>{user?.email}</strong></p>
                <p>If you didn't receive the email, check your spam folder or request a new one.</p>
                
                <Button onClick={handleResendVerification}>
                  Resend Verification Email
                </Button>
              </div>
            )}

            <div className="verification-info">
              <h4>Why verify your email?</h4>
              <ul>
                <li>Secure your account and enable password recovery</li>
                <li>Receive order confirmations and shipping updates</li>
                <li>Get notified about important account changes</li>
                <li>Access exclusive offers and promotions</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;