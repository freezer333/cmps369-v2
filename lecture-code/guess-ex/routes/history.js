const express = require('express');
const router = express.Router();

const logged_in = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("Not authorized");
    }
}

router.get('/', logged_in, async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;
    const games = await req.db.findCompleteGames(userId);
    res.render('history', { games: games });
});

router.get('/:gameId', logged_in, async (req, res) => {
    const game_guesses = await req.db.findGuesses(req.params.gameId);
    res.render('game', { game_guesses: game_guesses });
});

module.exports = router;