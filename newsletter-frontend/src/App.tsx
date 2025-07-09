import React from 'react';
import AppRouter from './router';
import Navbar from './components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';

export default function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
        <AppRouter />
    </BrowserRouter>
  );
}
