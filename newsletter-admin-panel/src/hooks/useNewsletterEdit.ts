import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewsletter, updateNewsletter } from '../api/newsletter';
import { getSmtpConfigs } from '../api/smtpConfig';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';

export function useNewsletterEdit(id: string | undefined) {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

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
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [newsletterRes, smtpRes] = await Promise.all([
          getNewsletter(id!),
          getSmtpConfigs(),
        ]);
        setForm({
          title: newsletterRes.data.title,
          content: newsletterRes.data.content,
          recipients: newsletterRes.data.recipients.map((r: any) => r.email),
          sendTime: newsletterRes.data.sendTime ? newsletterRes.data.sendTime.slice(0, 16) : '',
          batchSize: newsletterRes.data.batchSize,
          smtpConfig: newsletterRes.data.smtpConfig?._id || newsletterRes.data.smtpConfig || '',
          delay: newsletterRes.data.delay || 0,
        });
        setSmtpConfigs(smtpRes.data);
      } catch (e: any) {
        setError(e.response?.data?.error || 'Veriler alınamadı');
      }
      setLoading(false);
    };
    if (id) fetchData();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (editor && form.content) {
      editor.commands.setContent(form.content);
    }
    // eslint-disable-next-line
  }, [editor, form.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateNewsletter(id!, {
        ...form,
        batchSize: Number(form.batchSize),
      });
      setSnackbar({ open: true, message: 'Bülten güncellendi!', severity: 'success' });
      navigate(-1);
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Güncelleme başarısız', severity: 'error' });
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
    handleSubmit,
  };
} 