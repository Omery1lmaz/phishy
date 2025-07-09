import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Snackbar, CircularProgress } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getSmtpConfig, updateSmtpConfig } from '../api/smtpConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SmtpConfigEditPage() {
  const { id } = useParams();
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
    fetchConfig();
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

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;

  return (
    <Box display="flex" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif">
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: 28 }, p: { xs: 2, md: 4 }, mt: 0, minHeight: '100vh', background: '#f8fafc' }}>
        <Box maxWidth={500} mx="auto" mt={6}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <CardContent>
              <Typography variant="h5" fontWeight={800} mb={2}>Edit SMTP Config</Typography>
              <form onSubmit={handleSubmit} autoComplete="off">
                <TextField
                  label="Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Host"
                  value={form.host}
                  onChange={e => setForm(f => ({ ...f, host: e.target.value }))}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Port"
                  value={form.port}
                  onChange={e => setForm(f => ({ ...f, port: e.target.value } ))}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  type="number"
                />
                <TextField
                  label="User"
                  value={form.user}
                  onChange={e => setForm(f => ({ ...f, user: e.target.value }))}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Password"
                  value={form.pass}
                  onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  type="password"
                />
                {error && <Typography color="error" mb={2}>{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 700, borderRadius: 2 }} disabled={loading}>
                  {loading ? 'Updating...' : 'Update'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
} 