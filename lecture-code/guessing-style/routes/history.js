const express = require('express')
const router = express.Router();
const moment = require('moment');

router.get('/', async (req, res) => {
    const games = await req.db.findCompleteGames();
    console.log(games);
    games.forEach(g => g.time = moment(parseInt(g.time)).format('MMM D yyyy - h:mma'))
    res.render('history', { games: games });
})

router.get('/:gameId', async (req, res) => {
    const game_guesses = await req.db.findGuesses(req.params.gameId);
    game_guesses.forEach(g => g.time = moment(parseInt(g.time)).format('MMM D yyyy - h:mma'))
    res.render('game', { game_guesses: game_guesses });
});

module.exports = router;
