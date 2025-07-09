import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CreateIcon from '@mui/icons-material/Create';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 220,
  minHeight: '100vh',
  background: '#f7f9fc',
  borderRight: '1px solid #e0e0e0',
  paddingTop: 32,
  position: 'fixed',
  left: 0,
  top: 0,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const navItems = [
  { text: 'SMTP Settings', icon: <MailIcon color="primary" />, path: '/smtp-configs' },
  { text: 'Newsletters', icon: <ListAltIcon />, path: '/newsletters' },
  { text: 'Create Newsletter', icon: <CreateIcon />, path: '/newsletters/create' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
   <div></div>
  );
};

export default Sidebar; 