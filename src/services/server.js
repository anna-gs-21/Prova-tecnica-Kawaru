const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "kawaru"; 

const app = express();
app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          
  password: '****',  
  database: 'kawaru'
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
      { id: user.id, mail: user.mail }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      mensaje: 'Operació completada.', 
      token: token
    });
  });
});

app.post('/api/register', async (req, res) => {
  const { name, company, mail, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, company, mail, password) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, company, mail, hashedPassword], (err, result) => {
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


app.listen(5000, () => {
  console.log('Servidor backend corriendo en http://localhost:5000');
});
