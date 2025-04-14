const db = require('../models/db');

const ProfileController = {
  // show the profile page for the logged-in user
  show: (req, res) => {
    const user = req.session.user;

    // if not logged in, redirect to login
    if (!user) {
      return res.redirect('/login');
    }

    // get the user's data from the database
    db.get(`SELECT * FROM users WHERE email = ?`, [user.email], (err, userData) => {
      if (err || !userData) {
        return res.send("User not found.");
      }

      // render profile view with user's data
      res.render('profile', {
        user: userData,
        currentPath: '/profile'
      });
    });
  },

  // update the logged-in user's email
  update: (req, res) => {
    const { name, email } = req.body;
    const user = req.session.user;
  
    if (!user) return res.redirect('/login');
  
    db.run(
      `UPDATE users SET name = ?, email = ? WHERE email = ?`,
      [name, email, user.email],
      (err) => {
        if (err) {
          return res.send("Failed to update profile.");
        }
  
        // update the session info as well
        req.session.user.email = email;
        req.session.user.name = name;
  
        res.redirect('/profile');
      }
    );
  }  
};

module.exports = ProfileController;
