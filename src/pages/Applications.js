import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import {
  Alert,
  AlertTitle,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  MenuItem,
  Select, 
  Table, 
  TableCell, 
  TableHead, 
  TableRow, 
  TextField,
  Typography, 
} from '@mui/material';

function Login() {
  const [priorities, setPriorities] = useState([]);
  const [states, setStates] = useState([]);

  const [isOpenDialog, setOpenDialog] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [state, setState] = useState("");

  const [stateFilter, setStateFilter] = useState("");

  useEffect(() => {
    getStates();
    getPriorities();
  }, []);

  const getStates = () => {
    fetch('http://localhost:5000/api/states', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then((data) => setStates(data))
      .catch((err) => {
        console.log(err);
        //setAlertContent(err.message);
        //setShowAlert(true);
      });
  };

  const getPriorities = () => {
    fetch('http://localhost:5000/api/priorities', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then((data) => setPriorities(data))
      .catch((err) => {
        console.log(err);
        //setAlertContent(err.message);
        //setShowAlert(true);
      });
  };

  const postApplication = () => {
    if(title === "") {
      setAlertContent("No están tots els camps obligatoris omplerts.");
      setShowAlert(false);
    }

    const data = {
      title: title,
      description: description,
      priority: priority,
      state: state
    };

    fetch('http://localhost:5000/api/application', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((data) => {
      if(data.error) {
        setAlertContent(data.error);
        setShowAlert(true);
        return;
      }
      resetDialog();
    })
    .catch((err) => {
      setAlertContent(err.message);
      setShowAlert(true);
    });
  }

  const resetDialog = () => {
    isOpenDialog(false);
    setAlertContent("");
    setShowAlert(false);
    setTitle("");
    setDescription("");
    setPriority("");
    setState("");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Sol·licituds</Typography>
      
        <Grid container spacing={2}>
          <Grid size={2}>
            <Select
              fullWidth 
              value={stateFilter}
              label="Estat"
              onChange={(e) => setStateFilter(e.target.value)}
            >
              {states.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={4}>
            <Button 
              fullWidth
              startIcon={<AddIcon />}
              variant="contained" 
              onClick={(e) => {
                e.preventDefault();
                setOpenDialog(true)
              }}>
                Crear sol·licitud
            </Button>
          </Grid>
          <Grid size={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Títol</TableCell>
                  <TableCell align="right">Descripció</TableCell>
                  <TableCell align="right">Prioritat</TableCell>
                  <TableCell align="right">Estat</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Grid>
        </Grid>

        <Dialog
          onClose={() => resetDialog()} 
          open={isOpenDialog}
        >
          <DialogTitle>Crear sol·licitud</DialogTitle>
          <IconButton
            onClick={() => resetDialog()} 
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
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
                  fullWidth
                  label="Títol" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField 
                  fullWidth
                  label="Descripció" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid size={6}>
                <Select
                  fullWidth 
                  value={priority}
                  label="Prioritat"
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {priorities.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid size={6}>
                <Select
                  fullWidth 
                  value={state}
                  label="Estat"
                  onChange={(e) => setState(e.target.value)}
                >
                  {states.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              variant="contained" 
              color="error"
              onClick={() => resetDialog()}>
                Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={() => postApplication()}>
                Crear
            </Button>
          </DialogActions>
       </Dialog>
    </Container>
  );
}

export default Login;