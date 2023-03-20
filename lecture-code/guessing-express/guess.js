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

const start = async (req, res) => {
    const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;
    const id = await db.createGame(secret);
    res.render('guess', { gameId: id, secret: secret, guesses: [] });
}

const guess = async (req, res) => {
    const game = await db.findGame(req.body.gameId);
    if (!game) {
        res.writeHead(404);
        res.end();
        return;
    }

    await db.recordGuess(game, req.body.guess);
    const guesses = await db.findGuesses(game.id);

    // The built-in body parser doesn't cast to integer, 
    // so we need to do this ourselves...
    const guess = parseInt(req.body.guess);
    if (req.body.guess < game.secret) {
        res.render('guess', { gameId: game.id, result: 'too low', secret: game.secret, guesses: guesses });
    } else if (req.body.guess > game.secret) {
        res.render('guess', { gameId: game.id, result: 'too high', secret: game.secret, guesses: guesses });
    } else {
        await db.complete(game);
        res.render('complete', { secret: game.secret, guesses: guesses })
    }
}

const history = async (req, res) => {
    const games = await db.findCompleteGames();
    res.render('history', { games: games });
}

// Small difference - we could continue to use query 
// strings (?), however it's a bit easier to use URL
// parts, since express can match against them so nicely.
// The params field contains the parameter tokens in the 
// route definition
// Instead of /history?gameId=4
// the url is /history/4
// Important:  See the change in history.pug!
const game_history = async (req, res) => {
    const game_guesses = await db.findGuesses(req.params.gameId);
    res.render('game', { game_guesses: game_guesses });
}

app.get('/', start);
app.post('/', guess);
app.get('/history', history);
app.get('/history/:gameId', game_history);

app.listen(8080, () => {
    console.log(`Example app listening on port 8080`)
})