import axios from 'axios';

// For development, use empty string to leverage the proxy setup
// For production, use the environment variable
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://unhemmedestore-backend.onrender.com'
  : '';

console.log('API Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  API_BASE_URL,
  isProduction: process.env.NODE_ENV === 'production'
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  console.log('🚀 Making API request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL || ''}${config.url}`,
    headers: config.headers
  });
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API request successful:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API request failed:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullURL: `${error.config?.baseURL || ''}${error.config?.url}`,
      responseData: error.response?.data,
      stack: error.stack
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const productAPI = {
  getAll: () => api.get('/api/products'),
  getFeatured: () => api.get('/api/products/featured'),
  getById: (id) => api.get(`/api/products/${id}`),
  getByCategory: (category) => api.get(`/api/products?category=${category}`),
  getCategories: () => api.get('/api/products/categories'),
  search: (query) => api.get(`/api/products/search?q=${query}`),
};

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (userData) => api.put('/api/auth/profile', userData),
  updatePassword: (passwordData) => api.put('/api/auth/update-password', passwordData),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/api/auth/reset-password', { token, newPassword }),
  verifyEmail: (token) => api.post('/api/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),
  
  // Address management
  getAddresses: () => api.get('/api/auth/addresses'),
  addAddress: (addressData) => api.post('/api/auth/addresses', addressData),
  updateAddress: (addressId, addressData) => api.put(`/api/auth/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/api/auth/addresses/${addressId}`),
  setDefaultAddress: (addressId) => api.put(`/api/auth/addresses/${addressId}/default`),
  
  // Wishlist management
  getWishlist: () => api.get('/api/auth/wishlist'),
  addToWishlist: (productId) => api.post('/api/auth/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/api/auth/wishlist/${productId}`),
  
  // Account security
  getSecuritySettings: () => api.get('/api/auth/security'),
  updateSecuritySettings: (settings) => api.put('/api/auth/security', settings),
};

export const cartAPI = {
  get: () => api.get('/api/cart'),
  add: (productId, quantity) => api.post('/api/cart/add', { productId, quantity }),
  update: (productId, quantity) => api.put('/api/cart/update', { productId, quantity }),
  remove: (productId) => api.delete(`/api/cart/remove/${productId}`),
  clear: () => api.delete('/api/cart/clear'),
  moveToWishlist: (productId) => api.post('/api/cart/move-to-wishlist', { productId }),
  applyCoupon: (couponCode) => api.post('/api/cart/apply-coupon', { couponCode }),
  removeCoupon: () => api.delete('/api/cart/remove-coupon'),
};

export const orderAPI = {
  create: (orderData) => api.post('/api/orders', orderData),
  getAll: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
  cancelOrder: (id, reason) => api.put(`/api/orders/${id}/cancel`, { reason }),
  initiateReturn: (id, items, reason) => api.post(`/api/orders/${id}/return`, { items, reason }),
  trackOrder: (id) => api.get(`/api/orders/${id}/tracking`),
  getOrderHistory: (page = 1, limit = 10) => api.get(`/api/orders?page=${page}&limit=${limit}`),
};

export default api;
