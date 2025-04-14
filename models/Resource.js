
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    url TEXT,
    uploaded_by TEXT
  )
`);

const Resource = {
  create: (title, url, uploaded_by, callback) => {
    const stmt = `INSERT INTO resources (title, url, uploaded_by) VALUES (?, ?, ?)`;
    db.run(stmt, [title, url, uploaded_by], callback);
  },

  findAll: (callback) => {
    db.all(`SELECT * FROM resources`, callback);
  }
};

module.exports = Resource;
