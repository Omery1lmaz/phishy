import React from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItemIcon, ListItemText, CssBaseline, IconButton, Divider, useTheme, ListItemButton } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 220;

const navItems = [
  { text: 'SMTP Ayarları', icon: <SettingsIcon />, path: '/smtp-configs' },
  { text: 'Bültenler', icon: <MailIcon />, path: '/newsletters' },
  { text: 'Bülten Oluştur', icon: <AddCircleIcon />, path: '/newsletters/create' },
];

export default function DashboardLayout({ children }: React.PropsWithChildren<{}>) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.background.default }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Newsletters Admin Panel
          </Typography>
          <IconButton color="inherit" onClick={() => { localStorage.clear(); navigate('/admin-login'); }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#f5f7fa' },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.text} selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 400 }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8, minHeight: '100vh', background: '#f8fafc' }}>
        {children}
      </Box>
    </Box>
  );
} 