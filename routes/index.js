const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const GroupController = require('../controllers/GroupController');
const NotificationController = require('../controllers/NotificationController');
const ScheduleController = require('../controllers/ScheduleController');
const ResourceController = require('../controllers/ResourceController');
const ProfileController = require('../controllers/ProfileController');
const SearchController = require('../controllers/SearchController');
const AdminController = require('../controllers/AdminController');
const db = require('../models/db');
const multer = require('multer');



router.get('/', (req, res) => {
  res.render('index', { currentPath: '/' });
});

// auth routes
router.get('/', (req, res) => {
  res.render('index', { currentPath: '/' });
});
router.get('/login', (req, res) => {
  res.render('login', { currentPath: '/login' });
});
router.get('/signup', (req, res) => {
  res.render('signup', { currentPath: '/signup' });
});
router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);

// group routes
router.get('/create-group', GroupController.showCreateForm);
router.post('/create-group', GroupController.createGroup);
router.get('/groups/:id', GroupController.showGroup);
router.get('/groups/:id/edit', GroupController.editForm);
router.post('/groups/:id/edit', GroupController.update);

// invite route
router.post('/groups/:id/invite', GroupController.inviteUser);

// notification route
router.get('/notifications', NotificationController.show);
router.post('/notifications', NotificationController.update);

// schedule route
router.post('/rsvp', ScheduleController.rsvp);
router.post('/groups/:id/sessions', ScheduleController.create);
router.get('/groups/:id/schedule', ScheduleController.show);
router.post('/groups/:id/sessions', (req, res) => {
  const groupId = req.params.id;
  const { title, date } = req.body;

  db.run("INSERT INTO sessions (group_id, title, date) VALUES (?, ?, ?)",
    [groupId, title, date],
    (err) => {
      if (err) {
        console.error(err);
        return res.send("Error creating session");
      }
      res.redirect(`/groups/${groupId}/schedule`);
    });
});


// resource routes
router.post('/groups/:id/resources', ResourceController.upload);
router.post('/groups/:groupId/resources/:resourceId/delete', ResourceController.delete);

// profile routes
router.get('/profile', ProfileController.show);
router.post('/profile', ProfileController.update);

// admin routes
router.get('/admin-manage-users', AdminController.show);
router.post('/admin/add-user', AdminController.addUser);
router.post('/admin/toggle-status', AdminController.toggleStatus);
router.post('/admin/change-role', AdminController.changeRole);

// search routes
router.get('/search', SearchController.show);
router.post('/search', SearchController.search);
router.post('/join-group', SearchController.joinPrivate);

// logout route
router.get('/logout', (req, res) => {
  res.redirect('/');
});

// dashboard route
router.get('/dashboard', (req, res) => {
  const email = req.session.user.email;

  // get groups where the user is the owner
  const ownedQuery = "SELECT * FROM groups WHERE owner_email = ?";

  // get groups where the user is a member (joined via invite)
  const joinedQuery = `
    SELECT g.* FROM groups g
    JOIN group_members gm ON g.id = gm.group_id
    WHERE gm.user_email = ?
  `;

  db.all(ownedQuery, [email], (err, ownedGroups) => {
    if (err) {
      console.error(err);
      return res.send('error loading dashboard');
    }

    db.all(joinedQuery, [email], (err, joinedGroups) => {
      if (err) {
        console.error(err);
        return res.send('error loading dashboard');
      }

      // merge owned and joined groups, avoiding duplicates
      const allGroups = [...ownedGroups];

      joinedGroups.forEach(group => {
        if (!ownedGroups.find(g => g.id === group.id)) {
          allGroups.push(group);
        }
      });

      res.render('dashboard', {
        groups: allGroups,
        currentPath: '/dashboard',
        user: req.session.user
      });
    });
  });
});



module.exports = router;
