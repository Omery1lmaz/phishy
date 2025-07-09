import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { adminLogin, userLogin } from '../store/authSlice';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(adminLogin({ email: form.email, password: form.password }))
      // await adminLogin({ email: form.email, password: form.password });
      setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
      setTimeout(() => navigate('/'), 1200);
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Login failed', severity: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box display="flex" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif">
      <Box sx={{ flexGrow: 1, justifyContent: "center", alignItems: "center", ml: { xs: 0, md: 28 }, p: { xs: 2, md: 4 }, mt: 0, minHeight: '100vh', background: '#f8fafc' }}>
        <Box maxWidth={400} mx="auto" mt={10}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <CardContent>
              <Typography variant="h5" fontWeight={800} mb={2}>Admin Login</Typography>
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
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
              <Button
                variant="text"
                fullWidth
                sx={{ mt: 2, fontWeight: 600 }}
                onClick={() => navigate('/admin-register')}
              >
                Register
              </Button>
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