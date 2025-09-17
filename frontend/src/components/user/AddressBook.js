import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const AddressBook = () => {
  const { 
    addresses, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    loadAddresses, 
    loading 
  } = useApp();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAddresses();
  }, []);

  const resetForm = () => {
    setFormData({
      label: '',
      firstName: '',
      lastName: '',
      company: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phone: '',
      isDefault: false
    });
    setErrors({});
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const requiredFields = ['label', 'firstName', 'lastName', 'street', 'city', 'state', 'zipCode'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = editingAddress 
      ? await updateAddress(editingAddress._id, formData)
      : await addAddress(formData);
    
    if (result.success) {
      resetForm();
      loadAddresses();
    }
  };

  const handleEdit = (address) => {
    setFormData({
      label: address.label || '',
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      street: address.street || '',
      apartment: address.apartment || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'US',
      phone: address.phone || '',
      isDefault: address.isDefault || false
    });
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const result = await deleteAddress(addressId);
      if (result.success) {
        loadAddresses();
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="address-book">
      <div className="section-header">
        <h2>Address Book</h2>
        <Button onClick={() => setShowForm(true)}>
          Add New Address
        </Button>
      </div>

      {showForm && (
        <div className="address-form-container">
          <div className="form-header">
            <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="address-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="label">Address Label *</label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="e.g., Home, Work, Office"
                  className={errors.label ? 'error' : ''}
                />
                {errors.label && <span className="error-text">{errors.label}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="company">Company (Optional)</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="street">Street Address *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={errors.street ? 'error' : ''}
                />
                {errors.street && <span className="error-text">{errors.street}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="apartment">Apartment, Suite, etc. (Optional)</label>
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={errors.zipCode ? 'error' : ''}
                />
                {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                  {/* Add more countries as needed */}
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                  />
                  Set as default address
                </label>
              </div>
            </div>

            <div className="form-actions">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {editingAddress ? 'Update Address' : 'Save Address'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <div className="no-addresses">
            <h3>No addresses saved</h3>
            <p>Add your first address to make checkout faster.</p>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map(address => (
              <div key={address._id} className="address-card">
                <div className="address-header">
                  <h4>{address.label}</h4>
                  {address.isDefault && (
                    <span className="default-badge">Default</span>
                  )}
                </div>
                
                <div className="address-content">
                  <p className="address-name">
                    {address.firstName} {address.lastName}
                  </p>
                  {address.company && (
                    <p className="address-company">{address.company}</p>
                  )}
                  <p className="address-street">
                    {address.street}
                    {address.apartment && `, ${address.apartment}`}
                  </p>
                  <p className="address-location">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="address-country">{address.country}</p>
                  {address.phone && (
                    <p className="address-phone">{address.phone}</p>
                  )}
                </div>
                
                <div className="address-actions">
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleDelete(address._id)}
                    disabled={address.isDefault}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBook;