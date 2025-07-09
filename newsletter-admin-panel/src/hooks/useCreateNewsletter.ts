import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSmtpConfigs } from '../api/smtpConfig';
import { createNewsletter } from '../api/newsletter';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';

export function useCreateNewsletter() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    recipients: [] as string[],
    sendTime: '',
    batchSize: 100,
    smtpConfig: '',
    delay: 0,
  });
  const [smtpConfigs, setSmtpConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [selectedHost, setSelectedHost] = useState('');
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm(f => ({ ...f, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    const fetchSmtpConfigs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSmtpConfigs();
        setSmtpConfigs(res.data);
      } catch (e: any) {
        setError(e.response?.data?.error || 'SMTP ayarları alınamadı');
      }
      setLoading(false);
    };
    fetchSmtpConfigs();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (form.smtpConfig && smtpConfigs.length > 0) {
      const config = smtpConfigs.find(c => c._id === form.smtpConfig);
      if (config) setSelectedHost(config.host);
    }
    // eslint-disable-next-line
  }, [form.smtpConfig, smtpConfigs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createNewsletter({
        title: form.title,
        content: form.content,
        recipients: form.recipients,
        sendTime: form.sendTime,
        batchSize: form.batchSize,
        smtpConfig: form.smtpConfig,
        delay: form.delay,
      });
      setSnackbar({ open: true, message: 'Bülten oluşturuldu!', severity: 'success' });
      setForm({ title: '', content: '', recipients: [], sendTime: '', batchSize: 100, smtpConfig: '', delay: 0 });
      setSelectedHost('');
      setTimeout(() => navigate('/newsletters'), 1200);
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Oluşturma başarısız', severity: 'error' });
    }
    setLoading(false);
  };

  return {
    form,
    setForm,
    smtpConfigs,
    loading,
    error,
    snackbar,
    setSnackbar,
    editor,
    selectedHost,
    setSelectedHost,
    handleSubmit,
  };
} 