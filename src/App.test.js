if (!process.env.DB_HOST || process.env.DB_HOST === 'mysql_db') {
  process.env.DB_HOST = '127.0.0.1';
}

const request = require('supertest');
const app = require('./services/server.cjs');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

require('dotenv').config();

describe('Seguridad entre empresas', () => {
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
  });
    
  const token = jwt.sign(
    { id: 1, mail: "user1a@company1.com", idCompany: 1 }, 
    process.env.JWT_SECRET || 'tu_clave_secreta'
  );

  test('DEBE devolver tus solicitudes aunque intentes acceder a los de otra empresa', async () => {
    const response = await request(app)
      .get('/api/applications')
      .set('Authorization', `Bearer ${token}`) 
      .query({ idCompany: 2 }); 

    const solicitudesRecibidas = response.body.result;
    expect(solicitudesRecibidas).toBeDefined();

    solicitudesRecibidas.forEach(solicitud => {
      expect(solicitud.idCompany).toBe(1);
      expect(solicitud.idCompany).not.toBe(2);
    });
  });

  test('DEBE denegar la modificación de una solicitud si no pertenece a tu empresa', async () => {
    const response = await request(app)
      .patch('/api/application/2/status') 
      .set('Authorization', `Bearer ${token}`)
      .send({ idState: 2 });

    expect(response.status).toBe(400); 
  });

  test('DEBE denegar la creación de una solicitud de otra empresa', async () => {
    const response = await request(app)
      .post('/api/application') 
      .set('Authorization', `Bearer ${token}`)
      .query({ idCompany: 2 })
      .send({ 
        title: "Test Inyeccion URL",
        description: "Probando seguridad en query",
        idPriority: 1,
        idState: 1
    });

    const getResponse = await request(app)
    .get('/api/applications')
    .set('Authorization', `Bearer ${token}`);

    const misSolicitudes = getResponse.body.result;
    const solicitudGuardada = misSolicitudes.find(s => s.id === response.body.id);
    expect(solicitudGuardada).toBeDefined();
  });
});
