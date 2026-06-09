const connection = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper function to create a new user
const createUser = (userData, callback) => {
  const { name, email, password, role } = userData;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  
  connection.query(query, [name, email, hashedPassword, role], callback);
};

// Helper function to find a user by email
const findUserByEmail = (email, callback) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  connection.query(query, [email], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
};
