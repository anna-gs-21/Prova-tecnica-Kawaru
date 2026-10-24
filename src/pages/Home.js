import { useEffect}  from 'react';
import { Typography, Container } from '@mui/material';

function Home() {

  const user1 = {
    name: "1",
    idCompany: 1,
    mail: "1",
    password: "1"
  }

  const user2 = {
    name: "2",
    idCompany: 2,
    mail: "2",
    password: "2"
  }

  useEffect(() => {
    postUser(user1);
  }, []);

  const postUser = (data) => {
    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Home</Typography>
      <Typography variant="body1">¡Inicia sessió per veure les sol·licituds!</Typography>
    </Container>
  );
}

export default Home;