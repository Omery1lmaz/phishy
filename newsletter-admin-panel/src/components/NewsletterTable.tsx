import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, IconButton, Chip, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 15,
  borderRadius: 8,
  padding: '0 8px',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  margin: '0 4px',
  borderRadius: 8,
  '&:hover': {
    background: '#f0f4ff',
  },
}));

interface NewsletterTableProps {
  newsletters: any[];
  onDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const NewsletterTable: React.FC<NewsletterTableProps> = ({ newsletters, onDetail, onEdit, onDelete, loading }) => (
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
              <StatusChip label={n.status} color={n.status === 'Gönderildi' ? 'success' : n.status === 'Hata' ? 'error' : 'warning'} size="small" />
            </TableCell>
            <TableCell>{n.sendTime ? new Date(n.sendTime).toLocaleString() : '-'}</TableCell>
            <TableCell>{n.recipients?.length || 0}</TableCell>
            <TableCell sx={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {n.content?.replace(/<[^>]+>/g, '').slice(0, 80)}{n.content?.length > 80 ? '...' : ''}
            </TableCell>
            <TableCell>
              <Tooltip title="Detay" arrow>
                <ActionButton color="primary" onClick={() => onDetail(n._id)}>
                  <MailIcon />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Düzenle" arrow>
                <ActionButton color="info" onClick={() => onEdit(n._id)}>
                  <EditIcon />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Sil" arrow>
                <ActionButton color="error" onClick={() => onDelete(n._id)}>
                  <DeleteIcon />
                </ActionButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default NewsletterTable; 