import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select, 
  Snackbar,
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TextField,
  Typography, 
} from '@mui/material';

function Login() {
  const token = localStorage.getItem('token');

  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);

  const [priorities, setPriorities] = useState([]);
  const [states, setStates] = useState([]);

  const [isOpenDialog, setOpenDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    color: ""
  });  

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [state, setState] = useState("");

  const [stateFilter, setStateFilter] = useState(-1);

  const [anchorEl, setAnchorEl] =useState(null);
  const [selectedApplication, setSelectedApplication] =useState(null);
  const open = anchorEl;

  useEffect(() => {
    getStates();
    getPriorities();
    getApplications();
  }, []);

  const getApplications = () => {
    fetch('http://localhost:5000/api/applications', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then((data) => {
        if(data.error) {
          setSnackbar({ isOpen: true, message: data.error, color: "red" });
          return;
        }
        setApplications(data.result);
        setFilteredApplications(data.result);
      })
      .catch((err) => {
        setSnackbar({ isOpen: true, message: err, color: "red" });
      });
  }

  const getStates = () => {
    fetch('http://localhost:5000/api/states', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then((data) => {
        if(data.error) {
          setSnackbar({ isOpen: true, message: data.error, color: "red" });
          return;
        }
        setStates(data.result);
      })
      .catch((err) => {
        setSnackbar({ isOpen: true, message: err, color: "red" });
      });
  };

  const getPriorities = () => {
    fetch('http://localhost:5000/api/priorities', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then(res => res.json())
      .then((data) => {
        if(data.error) {
          setSnackbar({ isOpen: true, message: data.error, color: "red" });
          return;
        }
        setPriorities(data.result);
      })
      .catch((err) => {
        setSnackbar({ isOpen: true, message: err, color: "red" });
      });
  };

  const postApplication = () => {
    if(title === "") {
      setSnackbar({
        isOpen: true,
        message: "Error: faltan camps obligatoris",
        color: "red"
      });
    }

    const newApplication = {
      title: title,
      description: description,
      idPriority: priority,
      idState: state
    };

    fetch('http://localhost:5000/api/application', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newApplication)
    })
    .then(res => res.json())
    .then((data) => {
      if(data.error) {
        setSnackbar({ isOpen: true, message: data.error, color: "red" });
        return;
      }
      setSnackbar({ isOpen: true, message: data.message, color: "green" });
      setApplications([...applications, {...newApplication, id: data.id}]);
      handleFilter(stateFilter, [...applications, {...newApplication, id: data.id}]);
      resetDialog();
    })
    .catch((err) => {
      setSnackbar({ isOpen: true, message: err, color: "red" });
    });
  };

  const patchApplication = (state) => {
    fetch(`http://localhost:5000/api/application/${selectedApplication}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ idState: state })
    })
    .then(res => res.json())
    .then((data) => {
      if(data.error) {
        setSnackbar({ isOpen: true, message: data.error, color: "red" });
        return;
      }
      const newData = applications.map((a) => {
        if(a.id === selectedApplication) return {...a, idState: state}
        return a;
      });
      setSnackbar({ isOpen: true, message: data.message, color: "green" });
      setApplications(newData);
      handleFilter(stateFilter, newData);
    })
    .catch((err) => {
      setSnackbar({ isOpen: true, message: err, color: "red" });
    }); 
  };

  const resetDialog = () => {
    setOpenDialog(false);
    setTitle("");
    setDescription("");
    setPriority("");
    setState("");
  };

  const handleFilter = (value, data) => {
    setStateFilter(value);
    if(value < 0) {
      setFilteredApplications(data);
      return;
    }
    setFilteredApplications(data.filter((a) => a.idState === value));
  };

  const handleClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    setSelectedApplication(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Sol·licituds</Typography>
      <Snackbar
        open={snackbar.isOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbar({...snackbar, isOpen: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
        message={snackbar.message}
        slotProps={{ content: { sx: { backgroundColor: snackbar.color }}}}
      />
      <Grid container spacing={2}>
        <Grid size={2}>
          <Select
            fullWidth 
            value={stateFilter}
            label="Estat"
            onChange={(e) => handleFilter(e.target.value, applications)}
          >
            <MenuItem value={-1}>All</MenuItem>
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
                <TableCell>Descripció</TableCell>
                <TableCell>Prioritat</TableCell>
                <TableCell>Estat</TableCell>
                <TableCell>Accions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications?.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.title || "---"}</TableCell>
                  <TableCell>{a.description || "---"}</TableCell>
                  <TableCell>{priorities.find((p) => p.id === a.idPriority)?.name || "---"}</TableCell>
                  <TableCell>{states.find((s) => s.id === a.idState)?.name || "---"}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleClick(e, a.id)} > 
                      <EditIcon /> 
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {states.map((s) => (
            <MenuItem key={s.id} value={s.id} onClick={() => patchApplication(s.id)}>
              {s.name}
            </MenuItem>
          ))}
        </Menu>

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