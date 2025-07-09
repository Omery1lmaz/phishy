import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { token, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  return (
    <AppBar position="static">
      {/* <Toolbar>
        {role === 'admin' && <Button color="inherit" onClick={() => navigate('/admin')}>Yönetici Paneli</Button>}
        {role === 'user' && <Button color="inherit" onClick={() => navigate('/user')}>Bültenler</Button>}
        {(role === 'admin' || role === 'user') && <Button color="inherit" onClick={() => navigate('/smtp-configs')}>SMTP Ayarları</Button>}
        {token && <Button color="inherit" onClick={handleLogout}>Çıkış</Button>}
      </Toolbar> */}
    </AppBar>
  );
} 