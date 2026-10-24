import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, Snackbar, TextField, Typography } from '@mui/material';

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    color: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if(mail === "" || password === "") {
      setSnackbar({
        isOpen: true,
        message: "Error: faltan camps obligatoris",
        color: "red"
      });
      return;
    }

    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail, password })
    })
      .then(res => res.json())
      .then((data) => {
        if(data.error) {
          setSnackbar({ isOpen: true, message: data.error, color: "red" });
          return;
        }

        setSnackbar({ isOpen: true, message: data.message, color: "red"});

        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('companyId', data.user.idCompany);
        
        onLoginSuccess(); 
        navigate('/applications');
      })
      .catch((err) => {
        setSnackbar({ isOpen: true, message: err, color: "red" });
      });
  };

  return (
    <Container sx={{ mt: 4 }} >
      <Typography variant="h4" gutterBottom>Iniciar sessió</Typography>
      <Snackbar
        open={snackbar.isOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbar({...snackbar, isOpen: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
        message={snackbar.message}
        slotProps={{ content: { sx: { backgroundColor: snackbar.color }}}}
      />
      <Grid container spacing={2}>
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