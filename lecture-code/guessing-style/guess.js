const pug = require('pug');
const express = require('express');

// This is the core express instance, which 
// runs the route handling of our application
const app = express();
// This enabled a request body parser for form
// data.  It works a lot like our BodyParser
app.use(express.urlencoded({ extended: true }))
// Express will assume your pug templates are
// in the /views directory
app.set('view engine', 'pug');

// Database setup is the same as before
const Database = require('gdbcmps369');
const db = new Database();
db.initialize();

// Key concept:  Routes need access to the database.
// We only initialize the database once, and we use
// middleware to attach the database object to the
// request object BEFORE the routes are called.
app.use((req, res, next) => {
    req.db = db;
    next(); // ensures the route handlers will be called.
});

// Important:  We add the static route first - it will
// politely pass things on to "next" if the request doesn't
// match anything in our public director - which at this point
// is just the CSS file.  Take a look at layout.pug, it has
// the reference to the css file - and note that "public" is not
// part of the url.  The express-static module looks for files 
// relative to the root, but it looks in the specified folder.
app.use(express.static('public'))

app.use('/', require('./routes/play'));
app.use('/history', require('./routes/history'));

app.listen(8080, () => {
    console.log(`Example app listening on port 8080`)
})