import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSmtpConfig } from '../api/smtpConfig';

export function useSmtpConfigCreate() {
  const [form, setForm] = useState({ name: '', host: '', port: '', user: '', pass: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.name || !form.host || !form.port || !form.user || !form.pass) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    try {
      await createSmtpConfig({ ...form, port: Number(form.port) });
      setSnackbar({ open: true, message: 'SMTP config created!', severity: 'success' });
      setTimeout(() => navigate('/smtp-configs'), 1200);
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Create failed', severity: 'error' });
    }
    setLoading(false);
  };

  return { form, setForm, loading, error, snackbar, setSnackbar, handleSubmit };
} 