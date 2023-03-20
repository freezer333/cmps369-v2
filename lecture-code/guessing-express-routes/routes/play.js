const express = require('express')
const router = express.Router();

router.get('/', async (req, res) => {
    const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;
    const id = await req.db.createGame(secret);
    res.render('guess', { gameId: id, secret: secret, guesses: [] });
});

router.post('/', async (req, res) => {
    const game = await req.db.findGame(req.body.gameId);
    if (!game) {
        res.writeHead(404);
        res.end();
        return;
    }

    await req.db.recordGuess(game, req.body.guess);
    const guesses = await req.db.findGuesses(game.id);

    // The built-in body parser doesn't cast to integer, 
    // so we need to do this ourselves...
    const guess = parseInt(req.body.guess);
    if (guess < game.secret) {
        res.render('guess', { gameId: game.id, result: 'too low', secret: game.secret, guesses: guesses });
    } else if (guess > game.secret) {
        res.render('guess', { gameId: game.id, result: 'too high', secret: game.secret, guesses: guesses });
    } else {
        await req.db.complete(game);
        res.render('complete', { secret: game.secret, guesses: guesses })
    }
});

module.exports = router;

