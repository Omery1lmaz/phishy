import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Attach token from localStorage/sessionStorage to every request
instance.interceptors.request.use(
  (config) => {
    // You can change this to sessionStorage if you store token there
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance; 