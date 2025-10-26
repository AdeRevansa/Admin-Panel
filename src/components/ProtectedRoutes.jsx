// src/components/ProtectedRoutes.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoutes = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    // Show a full-page loader while checking auth
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not loading, check for user and render the page or redirect
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;