
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// create users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

const User = {
  create: (name, email, password, callback) => {
    const stmt = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(stmt, [name, email, password], callback);
  },

  findByEmail: (email, callback) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], callback);
  }
};

module.exports = User;
