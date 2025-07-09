import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Chip, Button, CircularProgress, Divider, IconButton, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Snackbar, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error';
import GroupIcon from '@mui/icons-material/Group';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getNewsletter } from '../api/newsletter';
import Sidebar from '../components/Sidebar';

export default function NewsletterDetailPage() {
  const { id } = useParams();
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // Filtre ve arama
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Gönderildi' | 'Sırada' | 'Hata'>('all');

  useEffect(() => {
    const fetchNewsletter = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getNewsletter(id!);
        setNewsletter(res.data);
      } catch (e: any) {
        setError(e.response?.data?.error || 'Bülten alınamadı');
      }
      setLoading(false);
    };
    fetchNewsletter();
  }, [id]);

  const filteredRecipients = useMemo(() => {
    if (!newsletter?.recipients) return [];
    return newsletter.recipients.filter((r: any) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesSearch = r.email.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [newsletter, search, statusFilter]);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!newsletter) return null;

  // Sayı hesapları
  const totalRecipients = newsletter.recipients?.length || 0;
  const sentCount = newsletter.recipients?.filter((r: any) => r.status === 'Gönderildi').length || 0;
  const batchSize = newsletter.batchSize;
  const delay = newsletter.delay || 0;
  const failedCount = newsletter.recipients?.filter((r: any) => r.status === 'Hata').length || 0;

  return (
    <Box display="flex" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif">
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: 28 }, p: { xs: 2, md: 4 }, mt: 0, minHeight: '100vh', background: '#f8fafc' }}>
        <Box maxWidth={900} mx="auto">
          {/* Üst Bar */}
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <IconButton onClick={() => navigate('/newsletters')} size="large" sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={900} flex={1} textAlign="center" letterSpacing={-1} sx={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
              Bülten Detayı
            </Typography>
          </Stack>
          {/* Kart */}
          <Card elevation={2} sx={{ borderRadius: 4, p: { xs: 2, md: 4 }, background: '#fff', mb: 4 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={800} mb={1} sx={{ fontFamily: 'Inter, Roboto, sans-serif', wordBreak: 'break-word' }}>
                {newsletter.title}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2}>
                <Chip icon={<AccessTimeIcon />} label={newsletter.sendTime ? new Date(newsletter.sendTime).toLocaleString() : '-'} color="default" sx={{ fontWeight: 600, fontSize: 14, borderRadius: 2 }} />
                <Chip icon={<GroupIcon />} label={`${totalRecipients} alıcı`} color="info" sx={{ fontWeight: 600, fontSize: 14, borderRadius: 2 }} />
                <Chip icon={<CheckCircleIcon />} label={`Gönderildi: ${sentCount}/${totalRecipients}`} color={sentCount === totalRecipients && totalRecipients > 0 ? 'success' : 'warning'} sx={{ fontWeight: 700, fontSize: 14, borderRadius: 2 }} />
                <Chip label={`Batch: ${batchSize}`} color="primary" sx={{ fontWeight: 600, fontSize: 14, borderRadius: 2 }} />
                <Chip label={`Delay: ${delay} sn`} color="default" sx={{ fontWeight: 600, fontSize: 14, borderRadius: 2 }} />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ background: '#f8fafc', borderRadius: 2, p: { xs: 2, md: 3 }, minHeight: 120, border: '1px solid #e0e0e0', fontSize: 17, color: '#222', fontFamily: 'Inter, Roboto, sans-serif', lineHeight: 1.7, wordBreak: 'break-word' }}>
                <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
              </Box>
            </CardContent>
          </Card>
          {/* Alıcılar Tablosu */}
          <Paper elevation={1} sx={{ borderRadius: 4, p: { xs: 1, md: 3 }, background: '#fff' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <Typography variant="h6" fontWeight={700} flex={1}>Alıcılar</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button variant={statusFilter === 'all' ? 'contained' : 'outlined'} size="small" onClick={() => setStatusFilter('all')}>Tümü</Button>
                <Button variant={statusFilter === 'Gönderildi' ? 'contained' : 'outlined'} color="success" size="small" onClick={() => setStatusFilter('Gönderildi')}>Gönderildi</Button>
                <Button variant={statusFilter === 'Sırada' ? 'contained' : 'outlined'} color="warning" size="small" onClick={() => setStatusFilter('Sırada')}>Sırada</Button>
                <Button variant={statusFilter === 'Hata' ? 'contained' : 'outlined'} color="error" size="small" onClick={() => setStatusFilter('Hata')}>Hata</Button>
              </Stack>
              <TextField
                size="small"
                placeholder="E-posta ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ minWidth: 200 }}
              />
            </Stack>
            <TableContainer sx={{ borderRadius: 2, maxHeight: 400, overflow: 'auto', boxShadow: 0 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ background: '#f5f5f5' }}>
                    <TableCell><b>E-posta</b></TableCell>
                    <TableCell><b>Durum</b></TableCell>
                    <TableCell><b>Oluşturulma</b></TableCell>
                    <TableCell><b>Hata</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecipients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ color: '#888' }}>
                        Sonuç bulunamadı.
                      </TableCell>
                    </TableRow>
                  ) : filteredRecipients.map((r: any, i: number) => (
                    <TableRow key={i} sx={{ background: i % 2 === 0 ? '#f9f9fb' : '#fff', '&:hover': { background: '#e3f2fd' } }}>
                      <TableCell>{r.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={r.status}
                          icon={
                            r.status === 'Gönderildi' ? <CheckCircleIcon fontSize="small" /> :
                            r.status === 'Sırada' ? <AccessTimeIcon fontSize="small" /> :
                            <ErrorIcon fontSize="small" />
                          }
                          color={
                            r.status === 'Gönderildi' ? 'success' :
                            r.status === 'Sırada' ? 'warning' : 'error'
                          }
                          size="small"
                          sx={{ fontWeight: 600, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        {r.error && (
                          <Tooltip title={r.error}>
                            <ErrorIcon color="error" fontSize="small" />
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
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