import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, Typography, Button, Container, TextField, Grid } from '@mui/material';

function Login() {
  const navigate = useNavigate();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if(mail === "" || password === "") {
      setAlertContent("No están tots els camps obligatoris omplerts.");
      setShowAlert(true);
      return;
    }

    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail, password })
    })
      .then(res => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/applications');
        }
        else {
          setAlertContent(data.error);
          setShowAlert(true);
        }
      })
      .catch((err) => setError(err.message));

    console.log("Email:", mail);
    console.log("Password:", password);
  };

  return (
    <Container sx={{ mt: 4 }} >
      <Typography variant="h4" gutterBottom>Iniciar sessió</Typography>

      <Grid container spacing={2}>
        {showAlert && (
          <Grid size={12}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {alertContent}
            </Alert>
          </Grid>
        )}
        <Grid size={12}>
          <TextField 
            required 
            label="Correu electrònic" 
            value={mail} 
            onChange={(e) => setMail(e.target.value)}/>
        </Grid>
        <Grid size={12}>
          <TextField 
            required 
            label="Contrassenya" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}/>
        </Grid>
        <Button variant="contained" onClick={handleSubmit}>Entrar</Button>
      </Grid>  
    </Container>
  );
}

export default Login;