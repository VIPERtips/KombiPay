
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kombiPayToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('kombiPayRefreshToken');
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/auth/refresh-token?refreshToken=${refreshToken}`);
          
          if (response.data && response.data.data && response.data.data.token) {
            AsyncStorage.setItem('kombiPayToken', response.data.data.token);
            AsyncStorage.setItem('kombiPayRefreshToken', response.data.data.refreshToken);
            
            // Retry the original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${response.data.data.token}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Logout user if refresh fails
        AsyncStorage.removeItem('kombiPayUser');
        AsyncStorage.removeItem('kombiPayToken');
        AsyncStorage.removeItem('kombiPayRefreshToken');
      
      }
    }
    
    return Promise.reject(error);
  }
);
