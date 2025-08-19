import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Verify token validity with backend
export const verifyToken = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.isValid;
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
    }
    return false;
  }
};

// Login user and get token
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Get current user data
export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};

// Logout user (clear token from storage)
export const logout = () => {
  localStorage.removeItem('adminToken');
  // Optional: Add API call to invalidate token on server
};

// Check if user has required role
export const hasRole = (user, requiredRole) => {
  return user?.role === requiredRole;
};