import axios from './axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function getSmtpConfigs() {
  return axios.get(`${API_URL}/smtp-configs`);
}

export function getSmtpConfig(id: string) {
  return axios.get(`${API_URL}/smtp-configs/${id}`);
}

export function createSmtpConfig(data: any) {
  return axios.post(`${API_URL}/smtp-configs`, data);
}

export function updateSmtpConfig(id: string, data: any) {
  return axios.put(`${API_URL}/smtp-configs/${id}`, data);
}

export function deleteSmtpConfig(id: string) {
  return axios.delete(`${API_URL}/smtp-configs/${id}`);
}

export function verifySmtpConfig(id: string) {
  return axios.post(`${API_URL}/smtp-configs/${id}/verify`);
} 