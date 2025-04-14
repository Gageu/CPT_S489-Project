
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// create session table
db.run(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    title TEXT,
    date TEXT
  )
`);

const Session = {
  create: (groupId, title, date, callback) => {
    db.run(`INSERT INTO sessions (group_id, title, date) VALUES (?, ?, ?)`,
      [groupId, title, date], callback);
  },

  findAll: (callback) => {
    db.all(`SELECT * FROM sessions`, callback);
  }
};

module.exports = Session;
