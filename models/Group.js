
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// create table
db.run(`
  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    owner TEXT NOT NULL
  )
`);

const Group = {
  create: (name, subject, description, owner, callback) => {
    const stmt = `INSERT INTO groups (name, subject, description, owner) VALUES (?, ?, ?, ?)`;
    db.run(stmt, [name, subject, description, owner], callback);
  },

  findById: (id, callback) => {
    db.get(`SELECT * FROM groups WHERE id = ?`, [id], callback);
  },

  findAll: (callback) => {
    db.all(`SELECT * FROM groups`, callback);
  }
};

module.exports = Group;
