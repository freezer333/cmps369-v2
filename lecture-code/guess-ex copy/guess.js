const express = require('express');

const Database = require('gdbcmps369');
const db = new Database();
db.initialize();

const app = express();
app.use(express.urlencoded({ extended: true }));

// Gets call on every request, before the routes.
// We can inject dependencies into the req (or res)
// so the routes have access to them.
app.use((req, res, next) => {
    console.log("Adding DB to request");
    req.db = db;
    next();
})

app.set('view engine', 'pug');

app.use('/', require('./routes/play'));
app.use('/history', require('./routes/history'));

app.listen(8080, () => {
    console.log('Server is running  on port 8080')
});




