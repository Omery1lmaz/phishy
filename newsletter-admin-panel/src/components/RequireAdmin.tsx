import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Navigate } from 'react-router-dom';

export function RequireAdmin({ children }: React.PropsWithChildren<{}>) {
  const { token, role } = useSelector((state: RootState) => state.auth);
  if (!token || role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }
  return <>{children}</>;
} 