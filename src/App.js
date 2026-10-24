import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

import ProtectedRoute from './components/ProtectedRoute.js';

import Login from './pages/Login.js';
import Home from './pages/Home.js';
import Applications from './pages/Applications.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const logOut = () => {
   localStorage.clear();
   setIsAuthenticated(false);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sol·licituds
          </Typography>
          {isAuthenticated ? (
            <Button color="inherit" onClick={logOut} component={Link} to="/">
              Tancar sessió
            </Button>
          ) : (
              <Button color="inherit" component={Link} to="/login">
                Iniciar sessió
              </Button>
            )}    
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)}/>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/applications" element={<Applications />} />
          </Route>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
