
const Group = require('../models/Group');
const Invite = require('../models/Invite');
const db = require('../models/db');

const GroupController = {
  showCreateForm: (req, res) => {
    res.render('create-group', {
      currentPath: '/create-group'
    });    
  },

  createGroup: (req, res) => {
    const { name, subject, description, privacy } = req.body;
    const user = req.session.user;

    if (!user) {
      return res.redirect('/login');
    }

    db.run(
      "INSERT INTO groups (name, subject, description, privacy, owner, owner_email) VALUES (?, ?, ?, ?, ?, ?)",
      [name, subject, description, privacy, user.name || user.email, user.email],

      function(err) {
        if (err) {
          console.error(err);
          res.send("Error creating group");
        } else {
          res.redirect('/dashboard');
        }
      }
    );
  },

  // show group details page
  showGroup: (req, res) => {
    const groupId = req.params.id;
    const currentUser = req.session.user;

    // get the group info from the database
    db.get("SELECT * FROM groups WHERE id = ?", [groupId], (err, group) => {
      if (err || !group) {
        return res.send("Group not found.");
      }

      // get invites for this group
      db.all("SELECT * FROM invites WHERE group_id = ?", [groupId], (err, invites) => {
        if (err) return res.send("Error loading invites.");

        // get members who accepted the invite
        db.all("SELECT name FROM users WHERE email IN (SELECT email FROM invites WHERE group_id = ? AND status = 'accepted')", [groupId], (err, members) => {
          if (err) return res.send("Error loading members.");

          // get all resources for this group
          db.all("SELECT * FROM resources WHERE group_id = ?", [groupId], (err, resources) => {
            if (err) return res.send("Error loading resources.");

            // get all sessions for this group
            db.all("SELECT * FROM sessions WHERE group_id = ?", [groupId], (err, sessions) => {
              if (err) return res.send("Error loading sessions.");

              // fetch the sessions the current user has RSVP'd to
              db.all("SELECT session_id FROM rsvps WHERE user_email = ?", [currentUser.email], (err, rsvps) => {
                if (err) return res.send("Error loading RSVPs.");

                // extract session_id values from RSVP records
                const attendingIds = rsvps.map(r => r.session_id);

                // finally render the full group page
                res.render('group', {
                  group,
                  invites,
                  members,
                  resources,
                  sessions,
                  attendingIds,
                  user: currentUser,
                  currentPath: ''
                });
              });
            });
          });
        });
      });
    });
  },

  inviteUser: (req, res) => {
    const groupId = req.params.id;
    const { email } = req.body;
    Invite.create(groupId, email, (err) => {
      if (err) res.send("Failed to send invite.");
      else res.redirect(`/groups/${groupId}`);
    });
  },
  
  editForm: (req, res) => {
    const groupId = req.params.id;
    db.get(`SELECT * FROM groups WHERE id = ?`, [groupId], (err, group) => {
      if (err || !group) {
        res.send("Group not found.");
      } else {
        res.render('edit-group', { group });
      }
    });
  },

  update: (req, res) => {
    const { name, subject, description } = req.body;
    const groupId = req.params.id;

    db.run(
      `UPDATE groups SET name = ?, subject = ?, description = ? WHERE id = ?`,
      [name, subject, description, groupId],
      (err) => {
        if (err) res.send("Failed to update group.");
        else res.redirect(`/groups/${groupId}`);
      }
    );
  }
};

module.exports = GroupController;
