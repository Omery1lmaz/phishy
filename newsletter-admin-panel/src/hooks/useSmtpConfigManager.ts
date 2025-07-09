import { useEffect, useState } from 'react';
import { getSmtpConfigs, deleteSmtpConfig, verifySmtpConfig } from '../api/smtpConfig';

export function useSmtpConfigManager() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string }>({ open: false });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

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

  return {
    configs,
    loading,
    deleteDialog,
    setDeleteDialog,
    snackbar,
    setSnackbar,
    fetchConfigs,
    handleDelete,
    handleVerify,
  };
} 