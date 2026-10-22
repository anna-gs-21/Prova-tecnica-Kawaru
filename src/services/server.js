const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,          
  password: process.env.DB_PASSWORD,  
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado exitosamente a MySQL local');
});

app.get('/api/applications', (req, res) => {
  const sql = "SELECT * FROM applications WHERE";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(result);
  });
});

app.get('/api/states', (req, res) => {
  const sql = "SELECT * FROM states";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(result);
  });
});

app.get('/api/priorities', (req, res) => {
  const sql = "SELECT * FROM priorities";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(result);
  });
});

app.post('/api/company', async (req, res) => {
  const { name } = req.body;

  try {
    const sql = "INSERT INTO companies (name) VALUES (?)";

    db.query(sql, [name], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ mensaje: "Operació completada." });
    });
  } catch(err){
    return res.status(500).json({ error: "Error intern." });
  }
});

app.post('/api/login', (req, res) => {
  const { mail, password } = req.body;
  
  const sql = "SELECT * FROM users WHERE mail = ?";

  db.query(sql, [mail], async (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    if (data.lenght === 0) return res.status(400).json({ error: "El correu electrònic no existeix." });

    const user = data[0];
    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) return res.status(400).json({ error: "La contrassenya és incorrecta." });

    const token = jwt.sign(
      { id: user.id, mail: user.mail, idCompany: user.idCompany }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      mensaje: 'Operació completada.', 
      token: token
    });
  });
});

app.post('/api/application', async (req, res) => {
  const { title, description, priority, state } = req.body;

  try {
    const sql = "INSERT INTO applications (title, idCompany, description, idPriority, idState) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [title, 1, description, priority, state], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Aquesta sol·licitud ja existeix." });
      }
      return res.status(500).json({ error: err.message });
    }
    
    return res.status(201).json({ mensaje: "Operació completada." });
  });
  } catch(err){
    return res.status(500).json({ error: "Error intern." });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, idCompany, mail, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, idCompany, mail, password) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, idCompany, mail, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Aquest correu electrònic ja existeix." });
      }
      return res.status(500).json({ error: err.message });
    }
    
    return res.status(201).json({ mensaje: "Operació completada." });
  });
  } catch(err){
    return res.status(500).json({ error: "Error intern." });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${process.env.PORT}`);
});
