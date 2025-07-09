import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSmtpConfig, updateSmtpConfig } from '../api/smtpConfig';

export function useSmtpConfigEdit(id: string | undefined) {
  const [form, setForm] = useState({ name: '', host: '', port: '', user: '', pass: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await getSmtpConfig(id!);
        setForm({
          name: res.data.name || '',
          host: res.data.host || '',
          port: String(res.data.port || ''),
          user: res.data.user || '',
          pass: res.data.pass || '',
        });
      } catch (e: any) {
        setError(e.response?.data?.error || 'Config not found');
      }
      setLoading(false);
    };
    if (id) fetchConfig();
  }, [id]);

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
      await updateSmtpConfig(id!, { ...form, port: Number(form.port) });
      setSnackbar({ open: true, message: 'SMTP config updated!', severity: 'success' });
      setTimeout(() => navigate('/smtp-configs'), 1200);
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Update failed', severity: 'error' });
    }
    setLoading(false);
  };

  return { form, setForm, loading, error, snackbar, setSnackbar, handleSubmit };
} 