const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


router.get('/logout', async (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})
router.get('/login', async (req, res) => {
    res.render('login', { hide_login: true });
});

router.post('/login', async (req, res) => {
    const email = req.body.email.trim();
    const p1 = req.body.password.trim();
    const user = await req.db.findUserByEmail(email);
    if (user && bcrypt.compareSync(p1, user.password)) {
        req.session.user = user;
        res.redirect('/');
        return;
    } else {
        res.render('login', { hide_login: true, message: 'Could not authenticate' });
        return;
    }
});

router.get('/signup', async (req, res) => {
    res.render('signup', { hide_login: true });
});

router.post('/signup', async (req, res) => {
    const email = req.body.email.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();
    if (p1 != p2) {
        res.render('signup', { hide_login: true, message: 'Passwords do not match!' });
        return;
    }

    const user = await req.db.findUserByEmail(email);
    if (user) {

        res.render('signup', { hide_login: true, message: 'This account already exists!' });
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(p1, salt);

    const id = await req.db.createUser(email, hash);
    req.session.user = await req.db.findUserById(id);
    res.redirect('/');
});


module.exports = router;