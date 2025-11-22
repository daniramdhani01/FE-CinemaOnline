import axios from 'axios';
import { getLocalStorage } from '../helper';

const baseURL = process.env.REACT_APP_BASE_URL+"/api/v1/"

export const API = axios.create({
    baseURL
});

API.interceptors.request.use(async (config) => {
  const token = getLocalStorage("AUS","token")
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  config.timeout = 10 * 1000;
  return config;
}, (err) => Promise.reject(err));

// Response interceptor for handling token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear stored authentication data
      localStorage.removeItem("AUS");

      // Only redirect if not already on login page
      if (window.location.pathname !== '/') {
        window.location.href = "/";
      }
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      // Optional: Show forbidden access message
      console.error('Access forbidden: Insufficient permissions');
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.error('Network error: Please check your connection');
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common["Authorization"];
    }
};

// Function to manually clear authentication and redirect
export const handleAuthLogout = () => {
  localStorage.removeItem("AUS");
  window.location.href = "/";
};
