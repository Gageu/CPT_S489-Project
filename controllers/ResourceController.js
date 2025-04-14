
const Resource = require('../models/Resource');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');

// set storage location and filename for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // save files to /public/uploads
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// initialize multer with the custom storage settings
const upload = multer({ storage: storage });


const ResourceController = {
  show: (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect('/login');
  
    db.all("SELECT * FROM resources", (err, resources) => {
      if (err) return res.send("Error loading resources");
  
      res.render('resource', {
        user,
        resources,
        canUpload: user.role === 'professor' || user.canUploadResources, // for students who own a group
        currentPath: '/resource'
      });
    });
  },
  upload: [
    upload.single('resource'),
    (req, res) => {
      const groupId = req.params.id;
      const user = req.session.user;
      const filename = req.file?.filename;

      if (!filename) {
        return res.send("No file uploaded.");
      }

      db.run("INSERT INTO resources (filename, uploaded_by, group_id) VALUES (?, ?, ?)",
        [filename, user.email, groupId],
        (err) => {
          if (err) {
            console.error("Error uploading file:", err);
            return res.send("Upload failed.");
          }
          res.redirect(`/groups/${groupId}`);
        });
    }
  ],
  delete: (req, res) => {
    const { groupId, resourceId } = req.params;
    const user = req.session.user;
  
    // first get the file's metadata to verify who uploaded it
    db.get("SELECT * FROM resources WHERE id = ?", [resourceId], (err, file) => {
      if (err || !file) {
        console.error("Error finding file to delete:", err);
        return res.send("File not found.");
      }
  
      const canDelete = user.email === file.uploaded_by || user.email === file.owner_email || user.role === 'admin';
      if (!canDelete) {
        return res.send("You do not have permission to delete this file.");
      }
  
      // delete the file from the database
      db.run("DELETE FROM resources WHERE id = ?", [resourceId], (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.send("Failed to delete.");
        }
  
        // optionally: delete from filesystem as well
        const fs = require('fs');
        const filePath = path.join(__dirname, '../public/uploads', file.filename);
        fs.unlink(filePath, () => {
          // silent fail if file doesn't exist
          res.redirect(`/groups/${groupId}`);
        });
      });
    });
  }  
};

module.exports = ResourceController;
