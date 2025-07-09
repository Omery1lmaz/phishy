import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Button, TextField, MenuItem, InputAdornment, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getNewsletters, deleteNewsletter } from '../api/newsletter';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NewsletterTable from '../components/NewsletterTable';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const statusOptions = [
  { value: 'all', label: 'Tümü' },
  { value: 'Planlandı', label: 'Planlandı' },
  { value: 'Gönderildi', label: 'Gönderildi' },
  { value: 'Hata', label: 'Hata' },
];

export default function Newsletters() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      await deleteNewsletter(id);
      setSnackbar({ open: true, message: 'Bülten silindi', severity: 'success' });
      fetchNewsletters();
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Silme başarısız', severity: 'error' });
    }
  };

  const filteredNewsletters = useMemo(() => {
    return newsletters.filter((n) => {
      const matchesStatus = statusFilter === 'all' || n.status === statusFilter;
      const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [newsletters, search, statusFilter]);

  return (
    <Box display="flex" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif">
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: 28 }, p: { xs: 2, md: 4 }, mt: 0, minHeight: '100vh', background: '#f8fafc' }}>
        <Box display="flex" alignItems={{ xs: 'stretch', sm: 'center' }} flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" mb={4} gap={2}>
          <Typography variant="h4" fontWeight={800} fontFamily="Inter, Roboto, sans-serif">Newsletters</Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
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
            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              sx={{ minWidth: 140, background: '#fff', borderRadius: 2 }}
            >
              {statusOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ borderRadius: 2, fontWeight: 700, fontSize: 16 }} onClick={() => navigate('/newsletters/create')}>
              Create Newsletter
            </Button>
          </Box>
        </Box>
        <NewsletterTable
          newsletters={filteredNewsletters}
          onDetail={id => navigate(`/newsletters/${id}`)}
          onEdit={id => navigate(`/newsletters/${id}/edit`)}
          onDelete={handleDelete}
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