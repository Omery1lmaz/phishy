import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, IconButton, Chip, Typography, Box, Card, CardContent, Stack, useMediaQuery } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

interface NewsletterTableProps {
  newsletters: any[];
  onDetail: (id: string) => void;
  loading?: boolean;
}

const NewsletterTable: React.FC<NewsletterTableProps> = ({ newsletters, onDetail, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {newsletters.length === 0 && !loading && (
          <Typography variant="h6" align="center" color="#888">No newsletters found.</Typography>
        )}
        {newsletters.map((n) => (
          <Card key={n._id} sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', background: '#fff' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700}>{n.title}</Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" my={1}>
                <Chip label={n.status} color={n.status === 'Gönderildi' ? 'success' : n.status === 'Hata' ? 'error' : 'warning'} size="small" sx={{ fontWeight: 700, fontSize: 15, borderRadius: 1, px: 1 }} />
                <Typography variant="body2">{n.sendTime ? new Date(n.sendTime).toLocaleString() : '-'}</Typography>
                <Typography variant="body2">Alıcı: {n.recipients?.length || 0}</Typography>
              </Stack>
              <Typography variant="body2" sx={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {n.content?.replace(/<[^>]+>/g, '').slice(0, 80)}{n.content?.length > 80 ? '...' : ''}
              </Typography>
              <Box mt={2}>
                <Tooltip title="Detay" arrow>
                  <IconButton color="primary" sx={{ m: 0.5, borderRadius: 2, '&:hover': { background: '#f0f4ff' } }} onClick={() => onDetail(n._id)}>
                    <MailIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', background: '#fff' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Başlık</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Durum</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Gönderim Zamanı</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Alıcı Sayısı</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Kısa İçerik</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newsletters.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ color: '#888' }}>
                <Typography variant="h6">No newsletters found.</Typography>
              </TableCell>
            </TableRow>
          )}
          {newsletters.map((n) => (
            <TableRow key={n._id} hover sx={{ background: '#f9f9fb', '&:hover': { background: '#e3f2fd' } }}>
              <TableCell sx={{ fontWeight: 600 }}>{n.title}</TableCell>
              <TableCell>
                <Chip
                  label={n.status}
                  color={n.status === 'Gönderildi' ? 'success' : n.status === 'Hata' ? 'error' : 'warning'}
                  size="small"
                  sx={{ fontWeight: 700, fontSize: 15, borderRadius: 1, px: 1 }}
                />
              </TableCell>
              <TableCell>{n.sendTime ? new Date(n.sendTime).toLocaleString() : '-'}</TableCell>
              <TableCell>{n.recipients?.length || 0}</TableCell>
              <TableCell sx={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {n.content?.replace(/<[^>]+>/g, '').slice(0, 80)}{n.content?.length > 80 ? '...' : ''}
              </TableCell>
              <TableCell>
                <Tooltip title="Detay" arrow>
                  <IconButton color="primary" sx={{ m: 0.5, borderRadius: 2, '&:hover': { background: '#f0f4ff' } }} onClick={() => onDetail(n._id)}>
                    <MailIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NewsletterTable; 