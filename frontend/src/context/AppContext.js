import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, cartAPI, orderAPI } from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  wishlist: [],
  addresses: [],
  orders: [],
  recentOrders: [],
  loading: false,
  error: null,
  authLoading: false,
  cartLoading: false,
  wishlistLoading: false,
  lastUpdated: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload };
    case 'SET_CART_LOADING':
      return { ...state, cartLoading: action.payload };
    case 'SET_WISHLIST_LOADING':
      return { ...state, wishlistLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        authLoading: false,
        lastUpdated: new Date().toISOString()
      };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        lastUpdated: new Date().toISOString()
      };
    case 'LOGOUT':
      return { 
        ...initialState
      };
    case 'SET_CART':
      const cartTotal = action.payload.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      return { 
        ...state, 
        cart: action.payload, 
        cartCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal,
        cartLoading: false
      };
    case 'ADD_TO_CART':
      const updatedCart = [...state.cart];
      const existingItem = updatedCart.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        updatedCart.push({
          productId: action.payload.productId,
          quantity: action.payload.quantity,
          price: action.payload.price,
          name: action.payload.name,
          image: action.payload.image,
          selectedSize: action.payload.selectedSize,
          selectedColor: action.payload.selectedColor
        });
      }
      const newCartTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        ...state,
        cart: updatedCart,
        cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal: newCartTotal
      };
    case 'UPDATE_CART_ITEM':
      const updatedCartForUpdate = state.cart.map(item => 
        item.productId === action.payload.productId 
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const updatedCartTotal = updatedCartForUpdate.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        ...state,
        cart: updatedCartForUpdate,
        cartCount: updatedCartForUpdate.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal: updatedCartTotal
      };
    case 'REMOVE_FROM_CART':
      const filteredCart = state.cart.filter(item => item.productId !== action.payload);
      const filteredCartTotal = filteredCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        ...state,
        cart: filteredCart,
        cartCount: filteredCart.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal: filteredCartTotal
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        cartCount: 0,
        cartTotal: 0
      };
    case 'SET_WISHLIST':
      return {
        ...state,
        wishlist: action.payload,
        wishlistLoading: false
      };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.productId !== action.payload)
      };
    case 'SET_ADDRESSES':
      return {
        ...state,
        addresses: action.payload
      };
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [...state.addresses, action.payload]
      };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(addr => 
          addr._id === action.payload._id ? action.payload : addr
        )
      };
    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter(addr => addr._id !== action.payload)
      };
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
        recentOrders: action.payload.slice(0, 5)
      };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        recentOrders: [action.payload, ...state.recentOrders].slice(0, 5)
      };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order => 
          order._id === action.payload._id ? action.payload : order
        )
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('token');
    if (token) {
      loadUserProfile();
    } else {
      // Load guest cart from localStorage
      loadGuestCart();
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      dispatch({ type: 'SET_AUTH_LOADING', payload: true });
      const response = await authAPI.getProfile();
      dispatch({ type: 'SET_USER', payload: response.data.user });
      
      // Load user data in parallel
      await Promise.all([
        loadCart(),
        loadWishlist(),
        loadAddresses(),
        loadRecentOrders()
      ]);
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
      dispatch({ type: 'SET_AUTH_LOADING', payload: false });
    }
  };

  const loadGuestCart = () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      dispatch({ type: 'SET_CART', payload: localCart });
    } catch (error) {
      dispatch({ type: 'SET_CART', payload: [] });
    }
  };

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_CART_LOADING', payload: true });
      const response = await cartAPI.get();
      dispatch({ type: 'SET_CART', payload: response.data.cart || [] });
    } catch (error) {
      dispatch({ type: 'SET_CART_LOADING', payload: false });
      // Fallback to local storage cart for guests
      if (!state.isAuthenticated) {
        loadGuestCart();
      }
    }
  };

  const loadWishlist = async () => {
    try {
      dispatch({ type: 'SET_WISHLIST_LOADING', payload: true });
      const response = await authAPI.getWishlist();
      dispatch({ type: 'SET_WISHLIST', payload: response.data.wishlist || [] });
    } catch (error) {
      dispatch({ type: 'SET_WISHLIST_LOADING', payload: false });
    }
  };

  const loadAddresses = async () => {
    try {
      const response = await authAPI.getAddresses();
      dispatch({ type: 'SET_ADDRESSES', payload: response.data.addresses || [] });
    } catch (error) {
      // Handle error silently
    }
  };

  const loadRecentOrders = async () => {
    try {
      const response = await orderAPI.getOrderHistory(1, 5);
      dispatch({ type: 'SET_ORDERS', payload: response.data.orders || [] });
    } catch (error) {
      // Handle error silently
    }
  };

  // Authentication functions
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_AUTH_LOADING', payload: true });
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({ type: 'SET_USER', payload: user });
      
      // Merge guest cart with user cart if user was shopping as guest
      const guestCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (guestCart.length > 0) {
        await mergeGuestCart(guestCart);
        localStorage.removeItem('cart');
      }
      
      // Load user data
      await Promise.all([
        loadCart(),
        loadWishlist(),
        loadAddresses(),
        loadRecentOrders()
      ]);
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
      dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_AUTH_LOADING', payload: true });
      const response = await authAPI.register(userData);
      
      // Registration might return user immediately or require email verification
      if (response.data.user) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'SET_USER', payload: user });
        
        // Load user data
        await Promise.all([
          loadCart(),
          loadWishlist(),
          loadAddresses()
        ]);
      } else {
        dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      }
      
      return { success: true, message: response.data.message };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Registration failed' });
      dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Handle error silently
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.updateProfile(userData);
      dispatch({ type: 'UPDATE_USER_PROFILE', payload: response.data.user });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to update profile' });
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Cart functions
  const mergeGuestCart = async (guestCart) => {
    try {
      for (const item of guestCart) {
        await cartAPI.add(item.productId, item.quantity);
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const addToCart = async (productId, quantity = 1, productDetails = null) => {
    try {
      if (state.isAuthenticated) {
        await cartAPI.add(productId, quantity);
        await loadCart(); // Reload to get updated cart with product details
      } else {
        // Handle local storage for non-authenticated users
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = localCart.find(item => item.productId === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          localCart.push({ 
            productId, 
            quantity, 
            price: productDetails?.price || 0,
            name: productDetails?.name || '',
            image: productDetails?.images?.[0]?.url || productDetails?.images?.[0] || '',
            selectedSize: productDetails?.selectedSize,
            selectedColor: productDetails?.selectedColor
          });
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
        dispatch({ type: 'ADD_TO_CART', payload: { 
          productId, 
          quantity, 
          price: productDetails?.price || 0,
          name: productDetails?.name || '',
          image: productDetails?.images?.[0]?.url || productDetails?.images?.[0] || '',
          selectedSize: productDetails?.selectedSize,
          selectedColor: productDetails?.selectedColor
        }});
      }
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
      return { success: false };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (state.isAuthenticated) {
        await cartAPI.update(productId, quantity);
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, quantity } });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' });
      return { success: false };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (state.isAuthenticated) {
        await cartAPI.remove(productId);
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const filteredCart = localCart.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(filteredCart));
      }
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      if (state.isAuthenticated) {
        await cartAPI.clear();
      } else {
        localStorage.removeItem('cart');
      }
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
      return { success: false };
    }
  };

  // Wishlist functions
  const addToWishlist = async (productId) => {
    try {
      if (!state.isAuthenticated) {
        dispatch({ type: 'SET_ERROR', payload: 'Please login to add items to wishlist' });
        return { success: false };
      }
      
      await authAPI.addToWishlist(productId);
      await loadWishlist();
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to wishlist' });
      return { success: false };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await authAPI.removeFromWishlist(productId);
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from wishlist' });
      return { success: false };
    }
  };

  const moveToWishlist = async (productId) => {
    try {
      if (!state.isAuthenticated) {
        dispatch({ type: 'SET_ERROR', payload: 'Please login to use wishlist' });
        return { success: false };
      }
      
      await cartAPI.moveToWishlist(productId);
      await Promise.all([loadCart(), loadWishlist()]);
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to move item to wishlist' });
      return { success: false };
    }
  };

  // Address functions
  const addAddress = async (addressData) => {
    try {
      const response = await authAPI.addAddress(addressData);
      dispatch({ type: 'ADD_ADDRESS', payload: response.data.address });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add address' });
      return { success: false };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await authAPI.updateAddress(addressId, addressData);
      dispatch({ type: 'UPDATE_ADDRESS', payload: response.data.address });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update address' });
      return { success: false };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await authAPI.deleteAddress(addressId);
      dispatch({ type: 'DELETE_ADDRESS', payload: addressId });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete address' });
      return { success: false };
    }
  };

  // Order functions
  const createOrder = async (orderData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await orderAPI.create(orderData);
      dispatch({ type: 'ADD_ORDER', payload: response.data.order });
      dispatch({ type: 'CLEAR_CART' });
      return { success: true, order: response.data.order };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create order' });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const value = {
    ...state,
    // Auth functions
    login,
    register,
    logout,
    updateProfile,
    loadUserProfile,
    
    // Cart functions
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    
    // Wishlist functions
    addToWishlist,
    removeFromWishlist,
    moveToWishlist,
    loadWishlist,
    
    // Address functions
    addAddress,
    updateAddress,
    deleteAddress,
    loadAddresses,
    
    // Order functions
    createOrder,
    loadRecentOrders,
    
    // Utility functions
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
