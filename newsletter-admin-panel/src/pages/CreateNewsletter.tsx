import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Stack, Autocomplete, MenuItem, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getSmtpConfigs } from '../api/smtpConfig';
import { createNewsletter } from '../api/newsletter';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { IconButton, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ImageIcon from '@mui/icons-material/Image';
import TitleIcon from '@mui/icons-material/Title';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const CardContainer = styled(Box)(({ theme }) => ({
  maxWidth: 700,
  margin: '40px auto',
  background: '#f9fafb',
  borderRadius: 12,
  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  padding: 0,
  fontFamily: 'Inter, Roboto, sans-serif',
}));

const Section = styled(Box)(({ theme }) => ({
  padding: '32px 32px 0 32px',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 8px 0 8px',
  },
}));

const RecipientsContainer = styled(Box)(({ theme }) => ({
  background: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  padding: '12px',
  minHeight: 64,
  maxHeight: 120,
  overflowY: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  position: 'relative',
}));

const MoreChip = styled('div')(({ theme }) => ({
  background: '#e3e7ef',
  borderRadius: 16,
  padding: '2px 12px',
  fontSize: 14,
  color: '#3a3a3a',
  cursor: 'pointer',
  alignSelf: 'center',
}));

const SendSettingsCard = styled(Box)(({ theme }) => ({
  background: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: 10,
  padding: '20px',
  marginTop: 24,
  marginBottom: 24,
}));

const isValidEmail = (email: string) =>
  /^\S+@\S+\.\S+$/.test(email);

const RECIPIENTS_VISIBLE = 8;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreateNewsletter() {
  const { token } = useSelector((state: RootState) => state.auth);
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
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [recipientInput, setRecipientInput] = useState('');
  const [showAllRecipients, setShowAllRecipients] = useState(false);
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

  const setLink = () => setLinkDialogOpen(true);
  const handleLinkDialogClose = () => { setLinkDialogOpen(false); setLinkUrl(''); };
  const handleLinkInsert = () => {
    if (linkUrl) editor?.chain().focus().setLink({ href: linkUrl }).run();
    handleLinkDialogClose();
  };

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
      },);
      setSnackbar({ open: true, message: 'Bülten oluşturuldu!', severity: 'success' });
      setForm({ title: '', content: '', recipients: [], sendTime: '', batchSize: 100, smtpConfig: '', delay: 0 });
      setSelectedHost('');
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.error || 'Oluşturma başarısız', severity: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box display="flex" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif">
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: 28 }, p: { xs: 2, md: 4 }, mt: 0, minHeight: '100vh', background: '#f8fafc' }}>
        <CardContainer>
          <Section>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 1, fontFamily: 'Inter, Roboto, sans-serif' }}>Create Newsletter</Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
              Fill in the newsletter details, content and recipient list to create a new campaign.
            </Typography>
            <form onSubmit={handleSubmit} autoComplete="off">
              <Stack spacing={4}>
                {/* Title */}
                <Box>
                  <Typography fontWeight={600} sx={{ mb: 1 }}>Title</Typography>
                  <TextField
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Enter newsletter title..."
                    fullWidth
                    size="medium"
                    inputProps={{ style: { fontSize: 20, fontWeight: 500, fontFamily: 'Inter, Roboto, sans-serif' } }}
                    sx={{ background: '#fff', borderRadius: 2 }}
                    required
                  />
                </Box>
                {/* Content */}
                <Box>
                  <Typography fontWeight={600} sx={{ mb: 1 }}>Content</Typography>
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, background: '#fff', mb: 1 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 1, gap: 1 }}>
                      <IconButton title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} color={editor?.isActive('bold') ? 'primary' : 'default'}><FormatBoldIcon /></IconButton>
                      <IconButton title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} color={editor?.isActive('italic') ? 'primary' : 'default'}><FormatItalicIcon /></IconButton>
                      <IconButton title="Underline" onClick={() => editor?.chain().focus().toggleUnderline().run()} color={editor?.isActive('underline') ? 'primary' : 'default'}><FormatUnderlinedIcon /></IconButton>
                      <IconButton title="Heading" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} color={editor?.isActive('heading', { level: 2 }) ? 'primary' : 'default'}><TitleIcon /></IconButton>
                      <IconButton title="Bullet List" onClick={() => editor?.chain().focus().toggleBulletList().run()} color={editor?.isActive('bulletList') ? 'primary' : 'default'}><FormatListBulletedIcon /></IconButton>
                      <IconButton title="Ordered List" onClick={() => editor?.chain().focus().toggleOrderedList().run()} color={editor?.isActive('orderedList') ? 'primary' : 'default'}><FormatListNumberedIcon /></IconButton>
                      <IconButton title="Align Left" onClick={() => editor?.chain().focus().setTextAlign('left').run()} color={editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}><FormatAlignLeftIcon /></IconButton>
                      <IconButton title="Align Center" onClick={() => editor?.chain().focus().setTextAlign('center').run()} color={editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}><FormatAlignCenterIcon /></IconButton>
                      <IconButton title="Align Right" onClick={() => editor?.chain().focus().setTextAlign('right').run()} color={editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}><FormatAlignRightIcon /></IconButton>
                      <IconButton title="Link" onClick={setLink} color={editor?.isActive('link') ? 'primary' : 'default'}><InsertLinkIcon /></IconButton>
                    </Box>
                    <Box sx={{ px: 2, pb: 2 }}>
                      <EditorContent editor={editor} />
                    </Box>
                  </Box>
                </Box>
                {/* Recipients */}
                <Box>
                  <Typography fontWeight={600} sx={{ mb: 1 }}>Recipients</Typography>
                  <TextField
                    value={recipientInput}
                    onChange={e => setRecipientInput(e.target.value)}
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ',' || e.key === ' ' || e.key === 'Tab') && recipientInput.trim()) {
                        e.preventDefault();
                        const emails = recipientInput.split(',').map(s => s.trim()).filter(Boolean);
                        let added = false;
                        emails.forEach(email => {
                          if (isValidEmail(email) && !form.recipients.includes(email)) {
                            setForm(f => ({ ...f, recipients: [...f.recipients, email] }));
                            added = true;
                          }
                        });
                        if (added) setRecipientInput('');
                      }
                    }}
                    onPaste={e => {
                      const text = e.clipboardData.getData('text');
                      const emails = text.split(',').map(s => s.trim()).filter(Boolean);
                      let added = false;
                      emails.forEach(email => {
                        if (isValidEmail(email) && !form.recipients.includes(email)) {
                          setForm(f => ({ ...f, recipients: [...f.recipients, email] }));
                          added = true;
                        }
                      });
                      if (added) setRecipientInput('');
                      e.preventDefault();
                    }}
                    placeholder="Type or paste emails, press Enter..."
                    fullWidth
                    size="medium"
                    sx={{ background: '#fff', borderRadius: 2, mb: 1 }}
                    InputProps={{ startAdornment: <AddIcon color="primary" /> }}
                    helperText="Press Enter or comma to add. Invalid emails are ignored."
                  />
                  <RecipientsContainer>
                    {(showAllRecipients ? form.recipients : form.recipients.slice(0, RECIPIENTS_VISIBLE)).map((email, idx) => (
                      <Tooltip key={email} title="Click to remove" arrow>
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: isValidEmail(email) ? '#e3e7ef' : '#ffeaea',
                            color: isValidEmail(email) ? '#222' : '#d32f2f',
                            borderRadius: 16,
                            px: 2,
                            py: 0.5,
                            fontSize: 14,
                            m: 0,
                            cursor: 'pointer',
                          }}
                          onClick={() => setForm(f => ({ ...f, recipients: f.recipients.filter(e => e !== email) }))}
                        >
                          {email}
                          <CloseIcon fontSize="small" sx={{ ml: 0.5 }} />
                        </Box>
                      </Tooltip>
                    ))}
                    {form.recipients.length > RECIPIENTS_VISIBLE && !showAllRecipients && (
                      <MoreChip onClick={() => setShowAllRecipients(true)}>
                        +{form.recipients.length - RECIPIENTS_VISIBLE} more
                      </MoreChip>
                    )}
                    {showAllRecipients && form.recipients.length > RECIPIENTS_VISIBLE && (
                      <MoreChip onClick={() => setShowAllRecipients(false)}>
                        Show less
                      </MoreChip>
                    )}
                  </RecipientsContainer>
                </Box>
                {/* Send Settings */}
                <SendSettingsCard>
                  <Typography fontWeight={700} sx={{ mb: 2, fontSize: 18 }}>Send Settings</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <TextField
                      label="Send Time"
                      type="datetime-local"
                      value={form.sendTime}
                      onChange={e => setForm(f => ({ ...f, sendTime: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ mb: { xs: 2, sm: 0 } }}
                    />
                    <TextField
                      label="Batch Size"
                      type="number"
                      value={form.batchSize}
                      onChange={e => setForm(f => ({ ...f, batchSize: Number(e.target.value) }))}
                      placeholder="10"
                      fullWidth
                      sx={{ mb: { xs: 2, sm: 0 } }}
                    />
                    <TextField
                      label="Delay (seconds)"
                      type="number"
                      value={form.delay}
                      onChange={e => setForm(f => ({ ...f, delay: Number(e.target.value) }))}
                      placeholder="0"
                      fullWidth
                      sx={{ mb: { xs: 2, sm: 0 } }}
                      helperText="Delay between batches (in seconds)"
                    />
                    <TextField
                      select
                      label="SMTP Host"
                      value={selectedHost}
                      onChange={e => {
                        setSelectedHost(e.target.value);
                        const config = smtpConfigs.find(c => c.host === e.target.value);
                        setForm(f => ({ ...f, smtpConfig: config?._id || '' }));
                      }}
                      fullWidth
                      required
                    >
                      <MenuItem value="">Select Host</MenuItem>
                      {smtpConfigs.map((c) => (
                        <MenuItem key={c._id} value={c.host}>{c.user}</MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                  {/* SMTP Info (show details if host selected) */}
                  {selectedHost && smtpConfigs.length > 0 && (
                    <Box sx={{ mt: 2, background: '#f6f8fa', borderRadius: 2, p: 2 }}>
                      {(() => {
                        const config = smtpConfigs.find(c => c.host === selectedHost);
                        if (!config) return null;
                        return (
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box><b>Host:</b> {config.host}</Box>
                            <Box><b>Port:</b> {config.port}</Box>
                            <Box><b>User:</b> {config.user}</Box>
                            <Box><b>Password:</b> <span style={{ letterSpacing: 2 }}>{config.pass ? '••••••••' : '-'}</span></Box>
                          </Stack>
                        );
                      })()}
                    </Box>
                  )}
                </SendSettingsCard>
                {/* Actions */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ borderRadius: 2, fontWeight: 700, fontSize: 18 }}>
                    Create Newsletter
                  </Button>
                  <Button variant="outlined" color="inherit" size="large" fullWidth sx={{ borderRadius: 2, fontWeight: 700, fontSize: 18 }} type="reset" onClick={() => setForm({ title: '', content: '', recipients: [], sendTime: '', batchSize: 100, smtpConfig: '', delay: 0 })}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Section>
        </CardContainer>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Dialog open={linkDialogOpen} onClose={handleLinkDialogClose}>
          <DialogTitle>Add Link</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Link URL"
              type="url"
              fullWidth
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLinkDialogClose}>Cancel</Button>
            <Button onClick={handleLinkInsert} variant="contained" disabled={!linkUrl}>Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
} 