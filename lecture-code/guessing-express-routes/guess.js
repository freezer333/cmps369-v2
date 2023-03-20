const pug = require('pug');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }))
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
})

app.use('/', require('./routes/play'));
app.use('/history', require('./routes/history'));

app.listen(8080, () => {
    console.log(`Example app listening on port 8080`)
})