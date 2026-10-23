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

const authCheck = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Accés denegat." });

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verificado;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token invàlid o expirat." });
  }
};

app.get('/api/applications', authCheck, (req, res) => {
  const sql = "SELECT * FROM applications WHERE idCompany = ?";
  db.query(sql, [req.user.idCompany], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(result);
  });
});

app.get('/api/states', authCheck, (req, res) => {
  const sql = "SELECT * FROM states";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(result);
  });
});

app.get('/api/priorities', authCheck, (req, res) => {
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
      token: token,
      user: {
        id: user.id,
        idCompany: user.idCompany
      }
    });
  });
});

app.post('/api/application', authCheck, async (req, res) => {
  const { title, description, idPriority, idState } = req.body;

  try {
    const sql = "INSERT INTO applications (title, idCompany, description, idPriority, idState) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [title, req.user.idCompany, description, idPriority, idState], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Aquesta sol·licitud ja existeix." });
      }
      return res.status(500).json({ error: err.message });
    }
    
    return res.status(201).json({ mensaje: "Operació completada.", id: result.insertId });
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

app.patch('/api/application/:id/status', authCheck, async (req, res) => {
  const { id } = req.params;
  const { idState } = req.body;

  try {
    const sql = "UPDATE applications SET idState = ? WHERE id = ?";

    db.query(sql, [idState, id], (err, result) => {
    if (err) {
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
