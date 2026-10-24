import { Typography, Container } from '@mui/material';

function Home() {

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Home</Typography>
      <Typography variant="body1">¡Inicia sessió per veure les sol·licituds!</Typography>
    </Container>
  );
}

export default Home;