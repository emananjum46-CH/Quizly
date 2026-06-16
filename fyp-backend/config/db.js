const mysql = require('mysql2/promise'); // 👈 Use promise-based version
require('dotenv').config();

// Create a connection pool instead of single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

// Verify connection
pool.getConnection()
  .then(conn => {
    console.log('Connected to MySQL DB');
    conn.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err);
  });

module.exports = pool;