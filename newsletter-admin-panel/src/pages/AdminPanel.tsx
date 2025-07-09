import React from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';

export default function AdminPanel() {
  return (
    <Box display="flex" minHeight="100vh" fontFamily="Inter, Roboto, sans-serif">
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: 28 }, p: { xs: 2, md: 4 }, mt: 0, minHeight: '100vh', background: '#f8fafc' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Yönetici Paneli</Typography>
          <Typography variant="body1">Hoş geldiniz! Soldaki menüden işlemlerinizi seçebilirsiniz.</Typography>
        </Box>
      </Box>
    </Box>
  );
} 