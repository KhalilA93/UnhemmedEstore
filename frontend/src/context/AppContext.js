import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, cartAPI } from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  cartCount: 0,
  loading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        cart: [], 
        cartCount: 0 
      };
    case 'SET_CART':
      return { 
        ...state, 
        cart: action.payload, 
        cartCount: action.payload.reduce((sum, item) => sum + item.quantity, 0) 
      };
    case 'ADD_TO_CART':
      const updatedCart = [...state.cart];
      const existingItem = updatedCart.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        updatedCart.push(action.payload);
      }
      return {
        ...state,
        cart: updatedCart,
        cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0)
      };
    case 'REMOVE_FROM_CART':
      const filteredCart = state.cart.filter(item => item.productId !== action.payload);
      return {
        ...state,
        cart: filteredCart,
        cartCount: filteredCart.reduce((sum, item) => sum + item.quantity, 0)
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
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.getProfile();
      dispatch({ type: 'SET_USER', payload: response.data.user });
      loadCart();
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
    }
  };

  const loadCart = async () => {
    try {
      const response = await cartAPI.get();
      dispatch({ type: 'SET_CART', payload: response.data.cart || [] });
    } catch (error) {
      console.error('Failed to load cart:', error);
      // If user is not authenticated, use local storage cart
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      dispatch({ type: 'SET_CART', payload: localCart });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      dispatch({ type: 'SET_USER', payload: user });
      loadCart();
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (state.isAuthenticated) {
        await cartAPI.add(productId, quantity);
      } else {
        // Handle local storage for non-authenticated users
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = localCart.find(item => item.productId === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          localCart.push({ productId, quantity });
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
      }
      dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity } });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
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

  const value = {
    ...state,
    login,
    logout,
    addToCart,
    removeFromCart,
    loadCart,
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
