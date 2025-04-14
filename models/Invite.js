
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// create invite table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS invites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    email TEXT,
    status TEXT DEFAULT 'pending'
  )
`);

const Invite = {
  create: (groupId, email, callback) => {
    const stmt = `INSERT INTO invites (group_id, email) VALUES (?, ?)`;
    db.run(stmt, [groupId, email], callback);
  },

  findByGroup: (groupId, callback) => {
    db.all(`SELECT * FROM invites WHERE group_id = ?`, [groupId], callback);
  }

  
};

const findByEmail = (email, callback) => {
    db.all(`SELECT * FROM invites WHERE email = ? AND status = 'pending'`, [email], callback);
  };
  
const updateStatus = (id, status, callback) => {
    db.run(`UPDATE invites SET status = ? WHERE id = ?`, [status, id], callback);
  };
  
 Invite.findByEmail = findByEmail;
  Invite.updateStatus = updateStatus;

module.exports = Invite;