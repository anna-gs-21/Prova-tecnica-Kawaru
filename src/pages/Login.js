import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Typography, Button, Container, Box, TextField, Grid } from '@mui/material';

function Login() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Iniciar sessió</Typography>

      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField required label="Correu electrònic" />
        </Grid>
        <Grid size={12}>
          <TextField required label="Contrassenya" type="password" />
        </Grid>
        <Button variant="contained">Entrar</Button>
      </Grid>  
    </Container>
  );
}

export default Login;