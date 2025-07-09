import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, IconButton, Chip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
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

interface SmtpConfigTableProps {
  configs: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onVerify: (id: string) => void;
  loading?: boolean;
}

const SmtpConfigTable: React.FC<SmtpConfigTableProps> = ({ configs, onEdit, onDelete, onVerify, loading }) => (
  <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', background: '#fff' }}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Name/User</TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Host</TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Port</TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Status</TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {configs.length === 0 && !loading && (
          <TableRow>
            <TableCell colSpan={5} align="center" sx={{ color: '#888' }}>
              <Typography variant="h6">No SMTP configs found.</Typography>
            </TableCell>
          </TableRow>
        )}
        {configs.map((c) => (
          <TableRow key={c._id} hover sx={{ background: '#f9f9fb', '&:hover': { background: '#e3f2fd' } }}>
            <TableCell sx={{ fontWeight: 600 }}>{c.name || c.user}</TableCell>
            <TableCell>{c.host}</TableCell>
            <TableCell>{c.port}</TableCell>
            <TableCell>
              {c.verified ? (
                <StatusChip label="Verified" color="success" />
              ) : (
                <StatusChip label="Not Verified" color="error" />
              )}
            </TableCell>
            <TableCell>
              <Tooltip title="Edit" arrow>
                <ActionButton color="primary" onClick={() => onEdit(c._id)}>
                  <EditIcon />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <ActionButton color="error" onClick={() => onDelete(c._id)}>
                  <DeleteIcon />
                </ActionButton>
              </Tooltip>
              {!c.verified && (
                <Tooltip title="Verify" arrow>
                  <ActionButton sx={{ color: '#8e24aa' }} onClick={() => onVerify(c._id)}>
                    <VerifiedIcon />
                  </ActionButton>
                </Tooltip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default SmtpConfigTable; 