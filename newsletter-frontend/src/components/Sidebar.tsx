import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CreateIcon from '@mui/icons-material/Create';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { text: 'Newsletters', icon: <ListAltIcon />, path: '/newsletters' },
  { text: 'Create Newsletter', icon: <CreateIcon />, path: '/newsletters/create' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box
      sx={{
        width: 220,
        minHeight: '100vh',
        background: '#f7f9fc',
        borderRight: '1px solid #e0e0e0',
        paddingTop: 4,
        position: 'fixed',
        left: 0,
        top: 0,
        // display: { xs: 'none', md: 'block' }, // kaldırıldı, Drawer ile kontrol edilecek
      }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={<span style={{ fontWeight: location.pathname === item.path ? 700 : 400 }}>{item.text}</span>} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar; 