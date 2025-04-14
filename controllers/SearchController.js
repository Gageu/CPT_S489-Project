
const Group = require('../models/Group');

const SearchController = {
  show: (req, res) => {
    res.render('search', {
      results: [],
      user: req.session.user,
      currentPath: '/search'
    });    
  },

  search: (req, res) => {
    const { query, privacy } = req.body;

    let sql = `SELECT * FROM groups WHERE name LIKE ? OR subject LIKE ?`;
    const params = [`%${query}%`, `%${query}%`];

    if (privacy && privacy !== 'all') {
      sql += ` AND privacy = ?`;
      params.push(privacy);
    }

    Group.rawQuery(sql, params, (err, results) => {
      if (err) return res.send("Search error.");
      res.render('search', { results });
    });
  },

  joinPrivate: (req, res) => {
    const { code } = req.body;
    // you’d check the access code here
    res.send(`Joining group with code: ${code}`); // for now
  }
};

module.exports = SearchController;
