import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || token === "null" || token === "undefined") {
      setIsValidating(false);
      return;
    }

    fetch('http://localhost:5000/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      if (res.ok) {
        setValid(true);
      } else {
        localStorage.clear();
      }
      setIsValidating(false);
    })
    .catch(() => {
      setIsValidating(false);
    });
  }, [token]);

  if (isValidating) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress aria-label="Loading…" />
      </Box>
    );
  }

  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
