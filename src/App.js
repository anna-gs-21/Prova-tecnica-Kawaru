import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

import ProtectedRoute from './components/ProtectedRoute.js';

import Login from './pages/Login.js';
import Home from './pages/Home.js';
import Applications from './pages/Applications.js';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sol·licituds
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            Iniciar sessió
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/applications" element={<Applications />} />
          </Route>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
