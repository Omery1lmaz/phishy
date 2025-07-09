import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import SentNewsletters from './pages/SentNewsletters';
import SentNewsletterDetail from './pages/SentNewsletterDetail';
import RequireAuth from './components/RequireAuth';
import DashboardLayout from './components/DashboardLayout';

export default function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={
        <RequireAuth>
          <DashboardLayout>
            <SentNewsletters />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-register" element={<UserRegister />} />
      <Route path="/newsletters" element={
        <RequireAuth>
          <DashboardLayout>
            <SentNewsletters />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="/newsletters/:id" element={
        <RequireAuth>
          <DashboardLayout>
            <SentNewsletterDetail />
          </DashboardLayout>
        </RequireAuth>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 