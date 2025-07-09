import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Snackbar, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NewsletterTable from '../components/NewsletterTable';
import { getNewsletters } from '../api/newsletter';
import RequireAuth from '../components/RequireAuth';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SentNewsletters() {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchNewsletters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNewsletters();
      setNewsletters(res.data);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Bültenler alınamadı');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const sentNewsletters = useMemo(() => {
    return newsletters.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));
  }, [newsletters, search]);

  return (
    <Box display="flex" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif">
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: 28 }, p: { xs: 2, md: 4 }, minHeight: '100vh', background: '#f8fafc' }}>
        <Box display="flex" alignItems={{ xs: 'stretch', sm: 'center' }} flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" mb={4} gap={2}>
          <Typography variant="h4" fontWeight={800} fontFamily="Inter, Roboto, sans-serif">Sent Newsletters</Typography>
          <TextField
            size="small"
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200, background: '#fff', borderRadius: 2 }}
          />
        </Box>
        <NewsletterTable
          newsletters={sentNewsletters}
          onDetail={id => navigate(`/newsletters/${id}`)}
          loading={loading}
        />
        {loading && (
          <Box textAlign="center" py={6}>
            <Typography variant="body1">Yükleniyor...</Typography>
          </Box>
        )}
        {error && (
          <Box textAlign="center" py={6}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
} 