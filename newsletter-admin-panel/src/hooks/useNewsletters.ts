import { useEffect, useState, useMemo } from 'react';
import { getNewsletters, deleteNewsletter } from '../api/newsletter';

export function useNewsletters() {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  return {
    newsletters,
    loading,
    error,
    snackbar,
    setSnackbar,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    fetchNewsletters,
    handleDelete,
    filteredNewsletters,
  };
} 