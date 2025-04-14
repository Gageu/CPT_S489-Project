
const User = require('../models/User');
const db = require('../models/db');


const AuthController = {
  showLogin: (req, res) => {
    res.render('login');
  },

  showSignup: (req, res) => {
    res.render('signup');
  },

  login: (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, user) => {
      if (email === 'admin@studygroup.com' && password === 'admin123') {
        req.session.user = {
          name: 'Admin',
          email: 'admin@studygroup.com',
          role: 'admin'
        };
        return res.redirect('/admin-manage-users');
      }
      if (user && user.password === password) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('login', { 
          error: 'Invalid email',
          user: null,
          currentPath: '/login' });
      }
    });
  },

  signup: (req, res) => {
    const { name, email, password, role } = req.body;
    if (!role) {
      return res.render('signup', {
        error: 'Please select a role',
        user: null,
        currentPath: '/signup'
      });
    }
  
    db.run(
      "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, role, 'Active'],
      err => {
        if (err) {
          console.error(err);
          return res.send("Error signing up");
        }
        res.redirect('/login');
      }
    );
  }  
};

module.exports = AuthController;
