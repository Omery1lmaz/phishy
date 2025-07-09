import { useState, useEffect, useMemo } from 'react';
import { getNewsletter } from '../api/newsletter';

export function useNewsletterDetail(id: string | undefined) {
  const [newsletter, setNewsletter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
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
    if (id) fetchNewsletter();
  }, [id]);

  const filteredRecipients = useMemo(() => {
    if (!newsletter?.recipients) return [];
    return newsletter.recipients.filter((r: any) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesSearch = r.email.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [newsletter, search, statusFilter]);

  return {
    newsletter,
    loading,
    error,
    snackbar,
    setSnackbar,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredRecipients,
  };
} 