import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ProfileSection from './ProfileSection';
import OrderHistory from './OrderHistory';
import AddressBook from './AddressBook';
import WishlistSection from './WishlistSection';
import SecuritySettings from './SecuritySettings';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, loading, error } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="user-dashboard-error">
        <h2>Access Denied</h2>
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'orders':
        return <OrderHistory />;
      case 'addresses':
        return <AddressBook />;
      case 'wishlist':
        return <WishlistSection />;
      case 'security':
        return <SecuritySettings />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>My Account</h1>
        <p>Welcome back, {user.firstName || user.name}!</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="dashboard-main">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;