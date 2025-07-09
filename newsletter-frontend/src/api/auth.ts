import axios from './axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function adminLoginApi(email: string, password: string) {
  return axios.post(`${API_URL}/auth/admin/login`, { email, password });
}

export function userLoginApi(email: string, password: string) {
  return axios.post(`${API_URL}/auth/user/login`, { email, password });
}

export function adminRegisterApi(email: string, password: string) {
  return axios.post(`${API_URL}/auth/admin/register`, { email, password });
}

export function userRegisterApi(email: string, password: string) {
  return axios.post(`${API_URL}/auth/user/register`, { email, password });
} 