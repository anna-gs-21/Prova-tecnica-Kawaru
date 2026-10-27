const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

  createUsers();
});

const createUsers = () => {
  const users = [
    { name: "Usuario 1A", idCompany: 1, mail: "user1a@company1.com", password: "1" },
    { name: "Usuario 1B", idCompany: 1, mail: "user1b@company1.com", password: "1" },
    { name: "Usuario 2A", idCompany: 2, mail: "user2a@company2.com", password: "1" },
    { name: "Usuario 2B", idCompany: 2, mail: "user2b@company2.com", password: "1" }
  ];

  users.forEach((u) => {
    try{
      db.query("SELECT id FROM users WHERE mail = ?", [u.mail], async (err, rows) => {
        if (err) return console.error("Error: ", err.message);

        if (rows.length === 0) {
          const sql = "INSERT INTO users (name, idCompany, mail, password) VALUES (?, ?, ?, ?)";
          const hashedPassword = await bcrypt.hash(u.password, 10);

          db.query(sql, [u.name, u.idCompany, u.mail, hashedPassword], (insertErr) => {
            if (insertErr) console.error(`Error:`, insertErr.message);
          });
        }
      });
    } catch(err) {
      console.error('Error creando usuarios: ', err);
    }
  });
};

const authCheck = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(400).json({ error: "Error: accés denegat" });

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verificado;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Error: token invàlid o expirat" });
  }
};

app.get('/api/auth/verify', authCheck, (req, res) => {
  return res.status(200).json({ valido: true });
});

app.get('/api/applications', authCheck, (req, res) => {
  try {
    const sql = "SELECT * FROM applications WHERE idCompany = ?";

    db.query(sql, [req.user.idCompany], (err, result) => {
      if (err) return res.status(500).json({ error: "Error: " + err.message });
      return res.status(200).json({result, message: "Éxit"});
    });
  } catch(err){
    return res.status(500).json({ error: "Error: parla amb l'administrador" });
  }
});

app.get('/api/states', authCheck, (req, res) => {
  try {
    const sql = "SELECT * FROM states";

    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: "Error: " + err.message });
      return res.status(200).json({result, message: "Éxit"});
    });
  } catch(err) {
    return res.status(500).json({ error: "Error: parla amb l'administrador" });
  }
});

app.get('/api/priorities', authCheck, (req, res) => {
  try{
    const sql = "SELECT * FROM priorities";

    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: "Error: " + err.message });
      return res.status(200).json({result, message: "Éxit"});
    });
  } catch(err) {
    return res.status(500).json({ error: "Error: parla amb l'administrador" });
  }
});

app.post('/api/company', async (req, res) => {
  try {
    const { name } = req.body;

    const sql = "INSERT INTO companies (name) VALUES (?)";

    db.query(sql, [name], (err, result) => {
      if (err) return res.status(500).json({ error: "Error: " + err.message });
      return res.status(200).json({ message: "Éxit: s'ha creat l'empresa" });
    });
  } catch(err){
    return res.status(500).json({ error: "Error: parla amb l'administrador" });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { mail, password } = req.body;
    
    const sql = "SELECT * FROM users WHERE mail = ?";

    db.query(sql, [mail], async (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length === 0) return res.status(400).json({ error: "Error: el correu electrònic no existeix" });

      const user = data[0];
      const isCorrect = await bcrypt.compare(password, user.password);

      if (!isCorrect) return res.status(400).json({ error: "Error: la contrassenya és incorrecta." });

      const token = jwt.sign(
        { id: user.id, mail: user.mail, idCompany: user.idCompany }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      return res.status(200).json({ 
        message: 'Éxit: sessió iniciada', 
        token: token,
        user: {
          id: user.id,
          idCompany: user.idCompany
        }
      });
    });
  } catch(err) {
    return res.status(500).json({ error: "Error: parla amb l'administrador" });
  }
});

app.post('/api/application', authCheck, async (req, res) => {
  try {
    const { title, description, idPriority, idState } = req.body;

    const sql = "INSERT INTO applications (title, idCompany, description, idPriority, idState) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [title, req.user.idCompany, description, idPriority, idState], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Error: aquesta sol·licitud ja existeix" });
      }
      return res.status(500).json({ error: err.message });
    }
    
    return res.status(200).json({ message: "Éxit: sol·licitud completada", id: result.insertId });
  });
  } catch(err){
    return res.status(500).json({ error: "Error: parla amb l'administrador" });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, idCompany, mail, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, idCompany, mail, password) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, idCompany, mail, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Error: aquest correu electrònic ja existeix" });
      }
      
      return res.status(500).json({ error: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Error: No tens permisos" });
    }
    
    return res.status(200).json({ message: "Éxit: usuari creat" });
  });
  } catch(err){
    return res.status(500).json({ error: "Error: parla amb l'administrador" });
  }
});

app.patch('/api/application/:id/status', authCheck, async (req, res) => {
   try {
     const { id } = req.params;
      const { idState } = req.body;

    const sql = "UPDATE applications SET idState = ? WHERE id = ? AND idCompany = ?";

    db.query(sql, [idState, id, req.user.idCompany], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error: "+ err.message });
    }
   
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Error: No tens permisos" });
    }
    
    return res.status(200).json({ message: "Éxit: estat canviat" });
  });
  } catch(err){
    return res.status(500).json({ error: "Error: parla amb l'administrador" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${process.env.PORT}`);
});

module.exports = app;