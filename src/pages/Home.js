import { useEffect}  from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

function Login() {

  const companyData = {
    name: "1"
  };

  const userData = {
    name: "1",
    idCompany: 1,
    mail: "1",
    password: "1"
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData) // Enviamos los datos al backend
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        }
        else{
          console.log("eyyy");
        }
      })
    .catch((err) => console.log(err.message));

    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData) // Enviamos los datos al backend
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        }
        else{
          console.log("eyyy");
        }
      })
    .catch((err) => console.log(err.message));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Home</Typography>
      <Typography variant="body1">¡Inicia sessió per veure les sol·licituds!</Typography>
    </Container>
  );
}

export default Login;