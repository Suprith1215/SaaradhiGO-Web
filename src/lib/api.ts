import axios from 'axios';

// 1 & 2: We use the URL from the .env file we just created
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vahango-web-application.onrender.com/api/v1';

// 3: Setup Axios to talk to the server
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This automatically checks if we have a token (from logging in) and attaches it to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// This handles errors, like if our token expires
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 401 (Unauthorized) and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
          try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        // Try to get a new token using the refresh endpoint from your docs
        const response = await axios.post(`${BASE_URL}/auth/refresh/`, {
          refresh_token: refreshToken
        });
        
        // Match structure: { status: "success", data: { token, refresh_token } }
        const result = response.data?.data || response.data;

        if (result && result.token) {
            localStorage.setItem('access_token', result.token);
            if (result.refresh_token) localStorage.setItem('refresh_token', result.refresh_token);

            // Retry the original request with the new token
            originalRequest.headers['Authorization'] = `Bearer ${result.token}`;
            return api(originalRequest);
        }
        throw new Error('Refresh failed - invalid format');
      } catch (refreshError) {
        // If refreshing fails, log the user out
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('saaradhigo_current_user');
        console.warn("Refresh token expired or invalid. User must re-login.");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
