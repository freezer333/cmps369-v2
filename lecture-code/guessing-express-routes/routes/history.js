const express = require('express')
const router = express.Router();

router.get('/', async (req, res) => {
    const games = await req.db.findCompleteGames();
    res.render('history', { games: games });
})

router.get('/:gameId', async (req, res) => {
    const game_guesses = await req.db.findGuesses(req.params.gameId);
    res.render('game', { game_guesses: game_guesses });
});

module.exports = router;
