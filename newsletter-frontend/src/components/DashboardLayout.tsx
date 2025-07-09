import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, CssBaseline, IconButton, Divider, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 220;

const navItems = [
  { text: 'Bültenler', icon: <MailIcon />, path: '/newsletters' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.text} selected={location.pathname === item.path} onClick={() => { navigate(item.path); setMobileOpen(false); }}>
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 400 }} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.background.default, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)' }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Newsletters Panel
          </Typography>
          <IconButton color="inherit" onClick={() => { localStorage.clear(); navigate('/user-login'); }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Drawer for desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#f5f7fa' },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      {/* Drawer for mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#f5f7fa' },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: 8, minHeight: '100vh', background: '#f8fafc', ml: !isMobile ? `${drawerWidth}px` : 0, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        {children}
      </Box>
    </Box>
  );
} 