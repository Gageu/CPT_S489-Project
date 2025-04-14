
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// create RSVP table
db.run(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    user_email TEXT
  )
`);

const RSVP = {
  toggle: (sessionId, email, callback) => {
    db.get(`SELECT * FROM rsvps WHERE session_id = ? AND user_email = ?`,
      [sessionId, email], (err, row) => {
        if (row) {
          db.run(`DELETE FROM rsvps WHERE id = ?`, [row.id], callback);
        } else {
          db.run(`INSERT INTO rsvps (session_id, user_email) VALUES (?, ?)`,
            [sessionId, email], callback);
        }
      });
  },

  findAllForUser: (email, callback) => {
    db.all(`SELECT session_id FROM rsvps WHERE user_email = ?`, [email], callback);
  }
};

module.exports = RSVP;
