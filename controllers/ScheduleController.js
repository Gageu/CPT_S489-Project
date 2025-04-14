const db = require('../models/db');

const ScheduleController = {

  show: (req, res) => {
    const groupId = req.params.id;
    const userEmail = req.session.user?.email;

    if (!userEmail) {
      return res.redirect('/login');
    }

    // get all sessions for the group
    db.all("SELECT * FROM sessions WHERE group_id = ?", [groupId], (err, sessions) => {
      if (err) {
        return res.send("Error fetching sessions");
      }

      // gets RSVP statuses for the current user
      db.all("SELECT session_id FROM rsvps WHERE user_email = ?", [userEmail], (err, rows) => {
        if (err) {
          return res.send("Error fetching RSVPs");
        }

        const attendingIds = rows.map(r => r.session_id);

        res.render('schedule', {
          sessions,
          attendingIds,
          group: { id: groupId, owner_email: req.session.user?.email }, 
          currentPath: `/groups/${groupId}/schedule`,
          user: req.session.user
        });
        
      });
    });
  },

  rsvp: (req, res) => {
    const { session_id } = req.body;
    const userEmail = req.session.user?.email;

    db.get("SELECT * FROM rsvps WHERE session_id = ? AND user_email = ?", [session_id, userEmail], (err, row) => {
      if (row) {
        // Already RSVPed, so remove it (toggle off)
        db.run("DELETE FROM rsvps WHERE session_id = ? AND user_email = ?", [session_id, userEmail], () => {
          res.redirect('back');
        });
      } else {
        // Add RSVP
        db.run("INSERT INTO rsvps (session_id, user_email) VALUES (?, ?)", [session_id, userEmail], () => {
          res.redirect('back');
        });
      }
    });
  },
  create: (req, res) => {
    const groupId = req.params.id;
    const { title, date } = req.body;
    const userEmail = req.session.user?.email;

    // insert the session into the database
    db.run(
      'INSERT INTO sessions (group_id, title, date) VALUES (?, ?, ?)',
      [groupId, title, date],
      function (err) {
        if (err) {
          console.error('Error creating session:', err);
          return res.send('Failed to create session.');
        }

        // redirect back to the group page instead of a separate schedule page
        res.redirect(`/groups/${groupId}`);
      }
    );
  }
};

module.exports = ScheduleController;
