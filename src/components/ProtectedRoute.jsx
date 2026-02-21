import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * Protects routes that require authentication.
 * Optionally restrict by role: roleRequired="ADMIN" | "COORDINATOR"
 */
export default function ProtectedRoute({ children, roleRequired }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired === 'ADMIN' && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  if (roleRequired === 'COORDINATOR' && user.role !== 'COORDINATOR' && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}
