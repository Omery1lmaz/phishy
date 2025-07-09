import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/auth';

export function useAdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin({ email: form.email, password: form.password });
      setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
      navigate('/admin')
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Login failed', severity: 'error' });
    }
    setLoading(false);
  };

  return { form, setForm, loading, snackbar, setSnackbar, handleSubmit };
} 