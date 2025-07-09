import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getSmtpConfigs, deleteSmtpConfig, verifySmtpConfig } from '../api/smtpConfig';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SmtpConfigTable from '../components/SmtpConfigTable';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SmtpConfigManager() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string }>({ open: false });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await getSmtpConfigs();
      setConfigs(res.data);
    } catch (e: any) {
      setSnackbar({ open: true, message: 'SMTP configs alınamadı', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      await deleteSmtpConfig(deleteDialog.id);
      setSnackbar({ open: true, message: 'SMTP config silindi', severity: 'success' });
      setDeleteDialog({ open: false });
      fetchConfigs();
    } catch (e: any) {
      setSnackbar({ open: true, message: 'Silme başarısız', severity: 'error' });
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await verifySmtpConfig(id);
      setSnackbar({ open: true, message: 'SMTP doğrulandı', severity: 'success' });
      fetchConfigs();
    } catch (e: any) {
      setSnackbar({ open: true, message: 'Doğrulama başarısız', severity: 'error' });
    }
  };

  return (
    <Box display="flex" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif">
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: 28 }, p: { xs: 2, md: 4 }, mt: 0, minHeight: '100vh', background: '#f8fafc' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" fontWeight={800} fontFamily="Inter, Roboto, sans-serif">SMTP Settings</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ borderRadius: 2, fontWeight: 700, fontSize: 16 }} onClick={() => navigate('/smtp-configs/new')}>
            Add New SMTP
          </Button>
        </Box>
        <SmtpConfigTable
          configs={configs}
          onEdit={id => navigate(`/smtp-configs/${id}/edit`)}
          onDelete={id => setDeleteDialog({ open: true, id })}
          onVerify={handleVerify}
          loading={loading}
        />
        {/* Delete Confirm Dialog */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
          <DialogTitle>Delete SMTP Config</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this SMTP configuration?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false })}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
        {/* Snackbar for notifications */}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
} 