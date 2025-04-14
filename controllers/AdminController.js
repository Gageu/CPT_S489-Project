const db = require('../models/db'); 

const AdminController = {
  show: (req, res) => {
    const user = req.session.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).send("Access Denied");
    }
  
    db.all("SELECT * FROM users", (err, users) => {
      if (err) return res.send("Error loading users");
      res.render('admin-manage-users', {
        users,
        user,
        currentPath: '/admin-manage-users'
      });
    });
  },
  
  addUser: (req, res) => {
    const { name, role } = req.body;
    const email = `${name.toLowerCase()}@example.com`; 

    db.run(`INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)`,
      [name, email, role, 'active'],
      (err) => {
        if (err) res.send("Failed to add user.");
        else res.redirect('/admin-manage-users');
      });
  },

  toggleStatus: (req, res) => {
    const { id, currentStatus } = req.body;
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';

    db.run(`UPDATE users SET status = ? WHERE id = ?`, [newStatus, id], (err) => {
      res.redirect('/admin-manage-users');
    });
  },

  changeRole: (req, res) => {
    const { id, newRole } = req.body;

    db.run(`UPDATE users SET role = ? WHERE id = ?`, [newRole, id], (err) => {
      res.redirect('/admin-manage-users');
    });
  }
};

module.exports = AdminController;
