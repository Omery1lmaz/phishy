import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { adminRegister } from '../api/auth';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdminRegister() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminRegister({ email: form.email, password: form.password });
      setSnackbar({ open: true, message: 'Registration successful!', severity: 'success' });
      setTimeout(() => navigate('/admin-login'), 1200);
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Registration failed', severity: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif" sx={{ background: '#f8fafc' }}>
      <Box maxWidth={400} width="100%">
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
          <CardContent>
            <Typography variant="h5" fontWeight={800} mb={2}>Admin Register</Typography>
            <form onSubmit={handleSubmit} autoComplete="off">
              <TextField
                label="Email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                fullWidth
                sx={{ mb: 2 }}
                required
                type="email"
              />
              <TextField
                label="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                fullWidth
                sx={{ mb: 2 }}
                required
                type="password"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 700, borderRadius: 2 }} disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
} 