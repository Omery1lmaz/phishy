import axios from './axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function getNewsletters() {
  return axios.get(`${API_URL}/newsletters`);
}

export function getNewsletter(id: string) {
  return axios.get(`${API_URL}/newsletters/${id}`);
}

export function createNewsletter(data: any) {
  return axios.post(`${API_URL}/newsletters`, data);
}

export function updateNewsletter(id: string, data: any) {
  return axios.put(`${API_URL}/newsletters/${id}`, data);
}

export function deleteNewsletter(id: string) {
  return axios.delete(`${API_URL}/newsletters/${id}`);
}

export function sendNewsletter(id: string) {
  return axios.post(`${API_URL}/newsletters/${id}/send`);
}

export function resendFailedRecipients(id: string) {
  return axios.post(`${API_URL}/newsletters/${id}/resend-failed`);
} 