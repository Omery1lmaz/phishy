import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import NewsletterDetailPage from './pages/NewsletterDetailPage';
import SmtpConfigManager from './pages/SmtpConfigManager';
import DashboardLayout from './components/DashboardLayout';
import NewsletterEditPage from './pages/NewsletterEditPage';
import Newsletters from './pages/Newsletters';
import CreateNewsletter from './pages/CreateNewsletter';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import { RequireAdmin } from './components/RequireAdmin';
import SmtpConfigCreatePage from './pages/SmtpConfigCreatePage';
import SmtpConfigEditPage from './pages/SmtpConfigEditPage';
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/" element={
        <RequireAdmin>
          <DashboardLayout>
            <AdminPanel />
          </DashboardLayout>
        </RequireAdmin>
      } />
      <Route path="/newsletters" element={
        <RequireAdmin>
          <DashboardLayout>
            <Newsletters />
          </DashboardLayout>
        </RequireAdmin>
      } />
      <Route path="/newsletters/create" element={
        <RequireAdmin>
          <DashboardLayout>
            <CreateNewsletter />
          </DashboardLayout>
        </RequireAdmin>
      } />
      <Route path="/newsletters/:id/edit" element={
        <RequireAdmin>
          <DashboardLayout>
            <NewsletterEditPage />
          </DashboardLayout>
        </RequireAdmin>
      } />
      <Route path="/newsletters/:id" element={
        <RequireAdmin>
          <DashboardLayout>
            <NewsletterDetailPage />
          </DashboardLayout>
        </RequireAdmin>
      } />
      <Route path="/smtp-configs" element={
        <RequireAdmin>
          <DashboardLayout>
            <SmtpConfigManager />
          </DashboardLayout>
        </RequireAdmin>
      } />
      <Route path="/smtp-configs/new" element={
        <RequireAdmin>
          <DashboardLayout>
            <SmtpConfigCreatePage />
          </DashboardLayout>
        </RequireAdmin>
      } />
      <Route path="/smtp-configs/:id/edit" element={
        <RequireAdmin>
          <DashboardLayout>
            <SmtpConfigEditPage />
          </DashboardLayout>
        </RequireAdmin>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
} 