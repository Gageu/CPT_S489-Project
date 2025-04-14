const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session'); 


const app = express();
const PORT = 3000;


app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;        
  res.locals.currentPath = req.path;                 
  next();
});

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
