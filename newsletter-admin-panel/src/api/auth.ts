import axios from './axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const adminLogin = (data: { email: string; password: string }) =>
  axios.post(`${API_URL}/auth/admin/login`, data);

export const adminRegister = (data: { email: string; password: string }) =>
  axios.post(`${API_URL}/auth/admin/register`, data); 