import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { userRegisterApi } from '../api/auth';
import { userRegister } from '../store/authSlice';
import type { AppDispatch } from '../store/store';
import { useDispatch } from 'react-redux';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function UserRegister() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(userRegister({ email: form.email, password: form.password })).unwrap().then(() => {
        navigate('/user-login')
        setSnackbar({ open: true, message: 'Registration successful!', severity: 'success' });
      }).catch((err) => {
        setSnackbar({ open: true, message: err.response?.data?.error || 'Registration failed', severity: 'error' });
      })
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Registration failed', severity: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif" sx={{ background: '#f8fafc', p: { xs: 1, sm: 2 } }}>
      <Box maxWidth={400} width="100%">
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', p: { xs: 1, sm: 2 } }}>
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h5" fontWeight={800} mb={2} fontSize={{ xs: 22, sm: 26 }}>User Register</Typography>
            <form onSubmit={handleSubmit} autoComplete="off">
              <TextField
                label="Email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                fullWidth
                sx={{ mb: 2 }}
                required
                type="email"
                size="small"
              />
              <TextField
                label="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                fullWidth
                sx={{ mb: 2 }}
                required
                type="password"
                size="small"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 700, borderRadius: 2, py: 1.2, fontSize: { xs: 15, sm: 17 } }} disabled={loading}>
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