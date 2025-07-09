import axios from './axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getNewsletters = () =>
  axios.get(`${API_URL}/newsletters`);

export const getNewsletter = (id: string) =>
  axios.get(`${API_URL}/newsletters/${id}`);

export const createNewsletter = (data: any) =>
  axios.post(`${API_URL}/newsletters`, data);

export const updateNewsletter = (id: string, data: any) =>
  axios.put(`${API_URL}/newsletters/${id}`, data);

export const deleteNewsletter = (id: string) =>
  axios.delete(`${API_URL}/newsletters/${id}`); 