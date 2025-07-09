import axios from './axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function authHeader(token?: string) {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

export function getSmtpConfigs(token?: string) {
  return axios.get(`${API_URL}/smtp-configs`, authHeader(token));
}

export function getSmtpConfig(id: string, token?: string) {
  return axios.get(`${API_URL}/smtp-configs/${id}`, authHeader(token));
}

export function createSmtpConfig(data: any, token: string) {
  return axios.post(`${API_URL}/smtp-configs`, data, authHeader(token));
}

export function updateSmtpConfig(id: string, data: any, token: string) {
  return axios.put(`${API_URL}/smtp-configs/${id}`, data, authHeader(token));
}

export function deleteSmtpConfig(id: string, token: string) {
  return axios.delete(`${API_URL}/smtp-configs/${id}`, authHeader(token));
}

export function verifySmtpConfig(id: string, token: string) {
  return axios.post(`${API_URL}/smtp-configs/${id}/verify`, {}, authHeader(token));
} 