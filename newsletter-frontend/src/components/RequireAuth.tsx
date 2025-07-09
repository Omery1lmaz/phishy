import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Navigate } from 'react-router-dom';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  if (!token || !role) {
    return <Navigate to="/user-login" replace />;
  }
  return <>{children}</>;
};

export default RequireAuth; 