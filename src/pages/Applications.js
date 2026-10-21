import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

function Login() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Sol·licituds</Typography>
      <Typography variant="body1">¡Inicia sessió per veure les sol·licituds!</Typography>
    </Container>
  );
}

export default Login;