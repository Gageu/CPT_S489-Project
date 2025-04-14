const Invite = require('../models/Invite');
const db = require('../models/db'); 

const NotificationController = {
  show: (req, res) => {
    const email = req.session.user.email;

    // get all invites sent to the logged in user's email
    Invite.findByEmail(email, (err, invites) => {
      res.render('notifications', {
        invites,
        currentPath: '/notifications',
        user: req.session.user // make sure user is passed
      });
    });
  },

  update: (req, res) => {
    const { id, action } = req.body;
    const status = action === 'accept' ? 'accepted' : 'declined';

    // update invite status first
    Invite.updateStatus(id, status, (err) => {
      if (err) {
        return res.send('Error updating invite');
      }

      if (status === 'accepted') {
        // fetch the invite again to get the group_id and email
        db.get("SELECT * FROM invites WHERE id = ?", [id], (err, invite) => {
          if (!err && invite) {
            // add this user to the group_members table
            db.run(
              "INSERT INTO group_members (group_id, user_email) VALUES (?, ?)",
              [invite.group_id, invite.email],
              (err) => {
                if (err) {
                  console.error("Error adding user to group_members:", err);
                }
                res.redirect('/notifications');
              }
            );
          } else {
            res.redirect('/notifications');
          }
        });
      } else {
        res.redirect('/notifications');
      }
    });
  }
};

module.exports = NotificationController;
